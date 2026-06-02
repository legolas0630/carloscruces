"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { TRACKS, Track } from "./tracks";

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
  const [currentTrack, setCurrentTrack] = useState<Track>(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shouldAutoplayRef = useRef(false);

  const filterRef = useRef<BiquadFilterNode | null>(null);
  const distortionRef = useRef<WaveShaperNode | null>(null);
  const crackleGainRef = useRef<GainNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const makeDistortionCurve = (amount: number) => {
    const k = amount * 100;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  };

  const createCrackleBuffer = (ctx: AudioContext) => {
    const duration = 4; // 4 seconds of unique noise
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      // Constant low-level surface hiss
      data[i] = (Math.random() * 2 - 1) * 0.005;
      // Random sparse pops/clicks
      if (Math.random() > 0.99995) {
        data[i] += (Math.random() * 2 - 1) * 0.3;
      }
    }
    return buffer;
  };

  const initAudioCtx = useCallback(() => {
    if (typeof window === "undefined" || audioCtxRef.current || !audioRef.current) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const source = ctx.createMediaElementSource(audioRef.current);
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 20; // Standard bass floor

      const distortion = ctx.createWaveShaper();
      distortion.curve = makeDistortionCurve(0);
      distortion.oversample = '4x';

      const crackleGain = ctx.createGain();
      crackleGain.gain.value = 0;
      
      const crackleSource = ctx.createBufferSource();
      crackleSource.buffer = createCrackleBuffer(ctx);
      crackleSource.loop = true;
      crackleSource.connect(crackleGain);
      crackleGain.connect(ctx.destination);
      crackleSource.start();

      source.connect(filter);
      filter.connect(distortion);
      distortion.connect(ctx.destination);

      audioCtxRef.current = ctx;
      filterRef.current = filter;
      distortionRef.current = distortion;
      crackleGainRef.current = crackleGain;
    } catch (e) {
      console.error("Web Audio API initialization failed", e);
    }
  }, []);

  const setHighPass = useCallback((freq: number) => {
    if (!audioCtxRef.current) initAudioCtx();
    filterRef.current?.frequency.setTargetAtTime(freq, audioCtxRef.current!.currentTime, 0.04);
  }, [initAudioCtx]);

  const setDistortion = useCallback((amount: number) => {
    if (!audioCtxRef.current) initAudioCtx();
    if (distortionRef.current) {
      distortionRef.current.curve = makeDistortionCurve(amount);
    }
  }, [initAudioCtx]);

  const setCrackle = useCallback((amount: number) => {
    if (!audioCtxRef.current) initAudioCtx();
    crackleGainRef.current?.gain.setTargetAtTime(amount, audioCtxRef.current!.currentTime, 0.05);
  }, [initAudioCtx]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      setCrackle(0.2); // Subtle base crackle when playing
      interval = setInterval(() => {
        if (audioRef.current) {
          const currentTime = audioRef.current.currentTime;
          const totalDuration = audioRef.current.duration;
          if (totalDuration > 0) {
            setProgress((currentTime / totalDuration) * 100);
          }
        }
      }, 200); // Update 5 times per second instead of 60+
    } else {
      setCrackle(0);
    }
    return () => clearInterval(interval);
  }, [isPlaying, setCrackle]);

  // Initialize audio element on mount
  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const skip = useCallback((dir: number) => {
    const idx = TRACKS.findIndex((t) => t.id === currentTrack.id);
    const next = TRACKS[(idx + dir + TRACKS.length) % TRACKS.length];
    shouldAutoplayRef.current = true;
    setCurrentTrack(next);
    setProgress(0);
  }, [currentTrack.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => skip(1);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.src = currentTrack.src;
    audio.load();
    audio.volume = volume;

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    if (shouldAutoplayRef.current) {
      audio.play().catch(err => console.log("Autoplay prevented:", err));
      shouldAutoplayRef.current = false;
    }

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [currentTrack, skip]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const play = useCallback((track?: Track) => {
    if (track && track.id !== currentTrack.id) {
      shouldAutoplayRef.current = true;
      setCurrentTrack(track);
      return;
    }

    audioRef.current?.play().catch(err => console.log(err));
  }, [currentTrack.id]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, pause, play]);

  const setManualProgress = useCallback((p: number) => {
    if (audioRef.current && audioRef.current.duration > 0) {
      audioRef.current.currentTime = (p / 100) * audioRef.current.duration;
      setProgress(p);
    }
  }, []);

  const setRate = useCallback((r: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = Math.max(0.1, Math.min(4, r));
    }
  }, []);

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
        setProgress: setManualProgress,
        setRate,
        setHighPass,
        setDistortion,
        setCrackle
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be used within a PlayerProvider");
  return context;
};
