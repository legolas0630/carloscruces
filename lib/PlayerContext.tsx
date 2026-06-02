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
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track>(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const shouldAutoplayRef = useRef(false);

  const updateProgress = useCallback(() => {
    if (audioRef.current && isPlaying) {
      const currentTime = audioRef.current.currentTime;
      const totalDuration = audioRef.current.duration;
      if (totalDuration > 0) {
        setProgress((currentTime / totalDuration) * 100);
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
