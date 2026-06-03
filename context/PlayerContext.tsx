"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { TRACKS, Track } from "@/lib/tracks";

interface PlayerContextType {
  currentTrack: Track;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  setVolume: (v: number) => void;
  play: (track?: Track) => void;
  pause: () => void;
  toggle: () => void;
  skip: (dir: number) => void;
  setProgress: (p: number) => void;
  setRate: (r: number) => void;
  setHighPass: (freq: number) => void;
  setDistortion: (amount: number) => void;
  setCrackle: (amount: number) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  // 1. Core Audio Component States
  const [currentTrack, setCurrentTrack] = useState<Track>(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgressState] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);

  // 2. Persistent Hardware Reference Anchors
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const distortionRef = useRef<WaveShaperNode | null>(null);
  const crackleGainRef = useRef<GainNode | null>(null);

  // Hydrate telemetry parameters safely on browser mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cc_last_track");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const matched = TRACKS.find(t => t.id === parsed.id);
          if (matched) setCurrentTrack(matched);
        } catch (e) {
          console.error("Failed to parse cached audio token structures:", e);
        }
      }
    }
  }, []);

  // Sync state modifications to disk cache layers
  useEffect(() => {
    if (currentTrack) {
      localStorage.setItem("cc_last_track", JSON.stringify(currentTrack));
    }
  }, [currentTrack]);

  // 3. Lazy Initialization for Web Audio API Matrix Controls
  const initAudioEngine = useCallback(() => {
    if (audioCtxRef.current || !audioRef.current) return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    const source = ctx.createMediaElementSource(audioRef.current);

    // Build processing racks
    const highPassFilter = ctx.createBiquadFilter();
    highPassFilter.type = "highpass";
    highPassFilter.frequency.value = 0;
    filterRef.current = highPassFilter;

    const waveShaper = ctx.createWaveShaper();
    waveShaper.curve = null;
    distortionRef.current = waveShaper;

    const crackleNode = ctx.createGain();
    crackleNode.gain.value = 0;
    crackleGainRef.current = crackleNode;

    // Direct wiring sequence paths
    source.connect(highPassFilter);
    highPassFilter.connect(waveShaper);
    waveShaper.connect(crackleNode);
    crackleNode.connect(ctx.destination);
  }, []);

  // 4. Core Audio Playback Controls
  const play = useCallback((track?: Track) => {
    initAudioEngine();
    if (audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume();
    }

    if (track) {
      setCurrentTrack(track);
      if (audioRef.current) {
        audioRef.current.src = track.src;
        audioRef.current.load();
      }
    }

    setTimeout(() => {
      audioRef.current?.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.warn("Playback initialization blocked by client security flags:", err));
    }, 50);
  }, [initAudioEngine]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  const skip = useCallback((dir: number) => {
    const index = TRACKS.findIndex(t => t.id === currentTrack.id);
    let nextIndex = index + dir;
    if (nextIndex >= TRACKS.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = TRACKS.length - 1;
    play(TRACKS[nextIndex]);
  }, [currentTrack, play]);

  const setProgress = useCallback((seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setProgressState(seconds);
    }
  }, []);

  const setVolume = useCallback((v: number) => {
    const boundedVolume = Math.max(0, Math.min(1, v));
    setVolumeState(boundedVolume);
    if (audioRef.current) {
      audioRef.current.volume = boundedVolume;
    }
  }, []);

  const setRate = useCallback((r: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = r;
    }
  }, []);

  // 5. FX Parameters Processing Controls
  const setHighPass = useCallback((freq: number) => {
    if (filterRef.current) {
      filterRef.current.frequency.setValueAtTime(freq, audioCtxRef.current?.currentTime || 0);
    }
  }, []);

  const makeDistortionCurve = (amount: number) => {
    const k = typeof amount === "number" ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  };

  const setDistortion = useCallback((amount: number) => {
    if (distortionRef.current) {
      distortionRef.current.curve = amount > 0 ? makeDistortionCurve(amount) : null;
    }
  }, []);

  const setCrackle = useCallback((amount: number) => {
    if (crackleGainRef.current) {
      crackleGainRef.current.gain.setValueAtTime(amount, audioCtxRef.current?.currentTime || 0);
    }
  }, []);

  // 6. Native Runtime Update Handlers
  const handleTimeUpdate = () => {
    if (audioRef.current) setProgressState(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleTrackEnded = () => {
    skip(1); // Auto-advances playlists on track completion
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        duration,
        volume,
        setVolume,
        play,
        pause,
        toggle,
        skip,
        setProgress,
        setRate,
        setHighPass,
        setDistortion,
        setCrackle,
      }}
    >
      {children}
      
      {/* Hidden native interface deck rendering pipeline */}
      <audio
        ref={audioRef}
        src={currentTrack?.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleTrackEnded}
        preload="metadata"
      />
    </PlayerContext.Provider>
  );
}

// 7. Clean Consumer Interface Endpoint
export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be run inside a unified PlayerProvider parent node.");
  }
  return context;
}