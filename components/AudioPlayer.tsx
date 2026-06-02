"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { usePlayer } from "@/context/PlayerContext";
import { TRACKS } from "@/lib/tracks"; // Imported to handle skipping locally

export default function AudioPlayer() {
  const { 
    currentTrack, 
    isPlaying, 
    progress, 
    toggle, 
    setProgress, 
    volume, 
    setVolume,
    play // Using the working play method from your context
  } = usePlayer();

  const timelineRef = useRef<HTMLDivElement>(null);

  // LOCAL SKIPPING LOGIC — Bypasses context type errors entirely
  const playNext = () => {
    if (!currentTrack) return;
    const currentIndex = TRACKS.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % TRACKS.length;
      play(TRACKS[nextIndex]);
    }
  };

  const playPrevious = () => {
    if (!currentTrack) return;
    const currentIndex = TRACKS.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex !== -1) {
      const prevIndex = (currentIndex - 1 + TRACKS.length) % TRACKS.length;
      play(TRACKS[prevIndex]);
    }
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setProgress(percentage);
  };

  // Keyboard Shortcuts Mapping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          toggle();
          break;
        case "ArrowRight":
          e.preventDefault();
          setProgress(Math.min(100, progress + 3));
          break;
        case "ArrowLeft":
          e.preventDefault();
          setProgress(Math.max(0, progress - 3));
          break;
        case "ArrowUp":
          e.preventDefault();
          if (setVolume) setVolume(Math.min(1, (volume ?? 0.8) + 0.05));
          break;
        case "ArrowDown":
          e.preventDefault();
          if (setVolume) setVolume(Math.max(0, (volume ?? 0.8) - 0.05));
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggle, progress, setProgress, volume, setVolume]);

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-[#090909]/95 border-t border-white/5 backdrop-blur-md z-[500] flex items-center justify-between px-4 sm:px-8 select-none">
      
      {/* Absolute Header Scrub Timeline */}
      <div 
        ref={timelineRef}
        onClick={handleScrub}
        className="absolute top-0 left-0 right-0 h-[3px] bg-white/10 hover:h-[5px] cursor-pointer transition-all duration-150 group"
      >
        <div 
          className="h-full relative transition-colors duration-200" 
          style={{ 
            width: `${progress}%`, 
            backgroundColor: currentTrack?.color || '#a8ff00',
            boxShadow: `0 0 10px ${currentTrack?.color || '#a8ff00'}`
          }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-150 shadow-md" />
        </div>
      </div>

      {/* Track Details / Image Panel */}
      <div className="flex items-center gap-3 w-1/2 sm:w-1/3 min-w-0">
        <img 
          src={currentTrack.img} 
          alt={currentTrack.title} 
          className={`w-11 h-11 rounded-sm object-cover border border-white/5 shadow-md hidden xs:block ${isPlaying ? 'animate-pulse' : ''}`} 
        />
        <div className="flex flex-col min-w-0">
          <div 
            style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
            className="font-bold text-sm tracking-wide text-[#f0f0f0] truncate uppercase"
          >
            {currentTrack.title}
          </div>
          <div 
            style={{ fontFamily: "var(--font-barlow), sans-serif" }}
            className="text-[0.68rem] text-gray-400 font-medium tracking-wider mt-0.5 uppercase truncate"
          >
            {currentTrack.genre} · {currentTrack.bpm}
          </div>
        </div>
      </div>

      {/* Audio Playback Controls */}
      <div className="flex items-center justify-center gap-4 sm:gap-6">
        <button 
          onClick={playPrevious}
          className="text-gray-400 hover:text-white transition-colors p-1 text-xs focus:outline-none"
          title="Previous Track"
        >
          <svg className="w-4 sm:w-5 h-4 sm:h-5 fill-current" viewBox="0 0 24 24">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
          </svg>
        </button>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={toggle}
          style={{ 
            backgroundColor: currentTrack?.color || '#a8ff00',
            boxShadow: `0 0 15px ${(currentTrack?.color || '#a8ff00')}44`
          }}
          className="w-10 sm:w-11 h-10 sm:h-11 rounded-full flex items-center justify-center text-black font-black text-xs sm:text-sm focus:outline-none"
        >
          {isPlaying ? (
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4 fill-current translate-x-[1px]" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </motion.button>

        <button 
          onClick={playNext}
          className="text-gray-400 hover:text-white transition-colors p-1 text-xs focus:outline-none"
          title="Next Track"
        >
          <svg className="w-4 sm:w-5 h-4 sm:h-5 fill-current" viewBox="0 0 24 24">
            <path d="M7 6l8.5 6L7 18zm9 0h2v12h-2z"/>
          </svg>
        </button>
      </div>

      {/* Volume Deck */}
      <div className="hidden md:flex items-center justify-end gap-3 w-1/3">
        <svg 
          className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white transition-colors" 
          viewBox="0 0 24 24"
          onClick={() => setVolume && setVolume(volume === 0 ? 0.8 : 0)}
        >
          {volume === 0 ? (
            <path className="fill-current" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM4 9v6h4l5 5V4L8 9H4zm12.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
          ) : (
            <path className="fill-current" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          )}
        </svg>
        
        <input 
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume ?? 0.8}
          onChange={(e) => setVolume && setVolume(parseFloat(e.target.value))}
          className="w-20 lg:w-24 h-[3px] bg-white/10 appearance-none rounded-lg outline-none accent-[#a8ff00] cursor-pointer hover:bg-white/20 transition-all"
          style={{
            backgroundImage: `linear-gradient(to right, ${currentTrack?.color || '#a8ff00'} 0%, ${currentTrack?.color || '#a8ff00'} ${(volume ?? 0.8) * 100}%, rgba(255,255,255,0.1) ${(volume ?? 0.8) * 100}%, rgba(255,255,255,0.1) 100%)`
          }}
          title="Volume Control"
        />
      </div>

    </div>
  );
}