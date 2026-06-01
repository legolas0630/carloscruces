"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { Howl } from "howler";
import { TRACKS, Track } from "./tracks";

interface PlayerContextType {
  currentTrack: Track;
  isPlaying: boolean;
  progress: number;
  volume: number;
  setVolume: (v: number) => void;
  play: (track?: Track) => void;
  pause: () => void;
  toggle: () => void;
  skip: (dir: number) => void;
  setProgress: (p: number) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track>(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const howlRef = useRef<Howl | null>(null);
  const requestRef = useRef<number | null>(null);
  const shouldAutoplayRef = useRef(false);

  const updateProgress = useCallback(() => {
    if (howlRef.current && isPlaying) {
      const seek = howlRef.current.seek() as number;
      const duration = howlRef.current.duration();
      if (duration > 0) {
        setProgress((seek / duration) * 100);
      }
      requestRef.current = requestAnimationFrame(updateProgress);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(updateProgress);
    } else if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, updateProgress]);

  const skip = useCallback((dir: number) => {
    const idx = TRACKS.findIndex((t) => t.id === currentTrack.id);
    const next = TRACKS[(idx + dir + TRACKS.length) % TRACKS.length];
    shouldAutoplayRef.current = true;
    setCurrentTrack(next);
    setProgress(0);
  }, [currentTrack.id]);

  const loadTrack = useCallback((track: Track) => {
    if (howlRef.current) {
      howlRef.current.unload();
    }

    const audioUrl = track.src;

    howlRef.current = new Howl({
      src: [audioUrl],
      html5: true,
      volume,
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
      onend: () => {
        setIsPlaying(false);
        setProgress(0);
        shouldAutoplayRef.current = true;
        skip(1);
      }
    });
  }, [skip, volume]);

  useEffect(() => {
    loadTrack(currentTrack);

    if (shouldAutoplayRef.current && howlRef.current) {
      shouldAutoplayRef.current = false;
      howlRef.current.play();
      setIsPlaying(true);
    }

    return () => {
      if (howlRef.current) howlRef.current.unload();
    };
  }, [currentTrack, loadTrack]);

  useEffect(() => {
    if (howlRef.current) {
      howlRef.current.volume(volume);
    }
  }, [volume]);

  const play = useCallback((track?: Track) => {
    if (track && track.id !== currentTrack.id) {
      shouldAutoplayRef.current = true;
      setCurrentTrack(track);
      return;
    }

    if (howlRef.current) {
      howlRef.current.play();
      setIsPlaying(true);
    }
  }, [currentTrack.id]);

  const pause = useCallback(() => {
    if (howlRef.current) {
      howlRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, pause, play]);

  const setManualProgress = useCallback((p: number) => {
    if (howlRef.current) {
      const duration = howlRef.current.duration();
      howlRef.current.seek((p / 100) * duration);
      setProgress(p);
    }
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        volume,
        setVolume,
        play,
        pause,
        toggle,
        skip,
        setProgress: setManualProgress
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
