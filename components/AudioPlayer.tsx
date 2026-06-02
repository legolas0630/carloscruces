"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayer } from "@/lib/PlayerContext";

function ControlBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      onClick={onClick} whileHover={{ color: "#a8ff00" }} whileTap={{ scale: 0.9 }}
      style={{ background: "none", border: "none", color: "#666", fontSize: "1.1rem", cursor: "pointer", transition: "color 0.2s" }}
    >
      {children}
    </motion.button>
  );
}

export default function AudioPlayer() {
  const { currentTrack, isPlaying, progress, duration, volume, setVolume, toggle, skip, setProgress } = usePlayer();
  const router = useRouter();
  const [showVolume, setShowVolume] = useState(false);
  const volumeRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleSeek = useCallback((clientX: number) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    // Clamp the value between 0 and the bar width
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setProgress(percentage);
  }, [setProgress]);

  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => handleSeek(e.clientX);
    const onTouchMove = (e: TouchEvent) => handleSeek(e.touches[0].clientX);
    const onStopDragging = () => setIsDragging(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onStopDragging);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onStopDragging);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onStopDragging);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onStopDragging);
    };
  }, [isDragging, handleSeek]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (volumeRef.current && !volumeRef.current.contains(event.target as Node)) {
        setShowVolume(false);
      }
    };

    if (showVolume) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showVolume]);

  return (
    <motion.div
      initial={{ y: 100 }} animate={{ y: 0 }} transition={{ type: "spring", damping: 20 }}
      className="fixed bottom-0 left-0 right-0 z-[200] bg-[#0a0a0a]/90 border-t border-white/5 backdrop-blur-lg sm:backdrop-blur-xl flex items-center gap-3 sm:gap-6 px-4 sm:px-8 h-20 sm:h-[72px]"
    >
      <div className="flex items-center gap-3 min-w-0 shrink-0 w-[9.5rem] sm:w-[14rem]">
        <div className="relative w-10 h-10 rounded-sm overflow-hidden border border-white/10 flex-shrink-0">
          <Image src={currentTrack.img} alt={currentTrack.title} fill className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <div style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em", color: "#f0f0f0" }} className="truncate">
            {currentTrack.title}
          </div>
          <div style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 300, fontSize: "0.7rem", color: "#666", marginTop: 2 }} className="hidden sm:block">
            {currentTrack.bpm}
          </div>
          <motion.button
            whileHover={{ color: "#a8ff00" }}
            onClick={() => {
              // We direct the user to the music page with the track selected
              // Or trigger the same modal if state was global
              router.push(`/music?download=${currentTrack.id}`);
            }}
            className="text-[0.6rem] text-gray-600 tracking-tighter mt-1 uppercase font-bold sm:hidden"
          >Download Track</motion.button>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <ControlBtn onClick={() => skip(-1)}>⏮</ControlBtn>
        <motion.button
          onClick={toggle} whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }}
          style={{
            width: 42, height: 42, borderRadius: "50%",
            background: "#a8ff00", border: "none", cursor: "pointer",
            fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: isPlaying ? "0 0 15px #a8ff00" : "none",
            transition: "box-shadow 0.3s"
          }}
        >
          {isPlaying ? "⏸" : "▶"}
        </motion.button>
        <ControlBtn onClick={() => skip(1)}>⏭</ControlBtn>
        
        <motion.button
          whileHover={{ color: "#f0f0f0" }}
          onClick={() => router.push(`/music?download=${currentTrack.id}`)}
          className="hidden sm:block text-[#444] ml-2"
          title="Download Current Track"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
          </svg>
        </motion.button>
      </div>

      <div 
        ref={progressRef}
        className="flex-1 cursor-pointer min-w-[60px] py-4 touch-none relative"
        onMouseDown={e => {
          setIsDragging(true);
          handleSeek(e.clientX);
        }}
        onTouchStart={e => {
          setIsDragging(true);
          handleSeek(e.touches[0].clientX);
        }}
      >
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0, y: 0, x: "-50%" }}
              animate={{ opacity: 1, y: -10, x: "-50%" }}
              exit={{ opacity: 0, y: 0, x: "-50%" }}
              className="absolute bottom-full bg-[#111] border border-[#1a1a1a] px-2 py-1 rounded shadow-xl pointer-events-none"
              style={{ left: `${progress}%`, zIndex: 210 }}
            >
              <span 
                className="text-[0.7rem] font-bold text-[#a8ff00] whitespace-nowrap"
                style={{ fontFamily: "var(--font-barlow-condensed), sans-serif" }}
              >
                {formatTime((progress / 100) * duration)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ height: 3, background: "#1a1a1a", borderRadius: 2, position: "relative" }}>
          <motion.div 
            animate={{ width: `${progress}%` }}
            transition={isDragging ? { type: "tween", duration: 0 } : { type: "tween", ease: "linear", duration: 0.2 }}
            style={{
              height: "100%", background: `linear-gradient(90deg, ${currentTrack.color}, #a8ff00)`,
              borderRadius: 2, boxShadow: `0 0 8px ${currentTrack.color}`
            }} 
          />
          <motion.div 
            animate={{ left: `${progress}%` }}
            transition={isDragging ? { type: "tween", duration: 0 } : { type: "tween", ease: "linear", duration: 0.2 }}
            style={{
              position: "absolute", top: "50%", transform: "translateY(-50%)",
              width: 10, height: 10, borderRadius: "50%",
              background: "#a8ff00", marginLeft: -5, boxShadow: "0 0 6px #a8ff00"
            }} 
          />
        </div>
        <div className="hidden sm:flex justify-between mt-1">
          <span style={{ fontSize: "0.65rem", color: "#444", fontFamily: "var(--font-barlow-condensed), sans-serif" }}>
            {formatTime((progress / 100) * duration)}
          </span>
          <span style={{ fontSize: "0.65rem", color: "#444", fontFamily: "var(--font-barlow-condensed), sans-serif" }}>
            {formatTime(duration)}
          </span>
        </div>
      </div>

      <div ref={volumeRef} className="relative flex items-center shrink-0">
        <button 
          onClick={() => setShowVolume(!showVolume)}
          className="p-2 sm:cursor-default"
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <span style={{ color: showVolume ? "#a8ff00" : "#666", fontSize: "0.8rem", transition: "color 0.2s" }}>🔊</span>
        </button>

        <div className="hidden sm:block ml-1">
          <input
            type="range" min="0" max="1" step="0.01" value={volume}
            aria-label="Volume"
            title="Volume"
            onChange={e => setVolume(Number(e.target.value))}
            style={{
              width: 80, accentColor: "#a8ff00", cursor: "pointer",
              WebkitAppearance: "none", height: 3,
              background: `linear-gradient(to right, #a8ff00 ${volume * 100}%, #1a1a1a ${volume * 100}%)`,
              outline: "none", borderRadius: 2
            }}
          />
        </div>

        <AnimatePresence>
          {showVolume && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 10, x: "-50%" }}
              className="absolute bottom-full left-1/2 mb-6 bg-[#111] p-4 rounded border border-[#1a1a1a] shadow-2xl flex items-center gap-3 sm:hidden"
              style={{ zIndex: 201 }}
            >
              <input
                type="range" min="0" max="1" step="0.01" value={volume}
                aria-label="Volume"
                title="Volume"
                onChange={e => setVolume(Number(e.target.value))}
                style={{
                  width: 100, accentColor: "#a8ff00", cursor: "pointer",
                  WebkitAppearance: "none", height: 4,
                  background: `linear-gradient(to right, #a8ff00 ${volume * 100}%, #1a1a1a ${volume * 100}%)`,
                  outline: "none", borderRadius: 2
                }}
              />
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#a8ff00", minWidth: "20px" }}>
                {Math.round(volume * 100)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
