"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WaveformVisualizer from "./WaveformVisualizer"; // Reusing your modular component

interface TrackItemProps {
  track: any;
  isCurrent: boolean;
  duration: string;
  onSelect: () => void;
}

const TrackItem = ({ track, isCurrent, duration, onSelect }: TrackItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative group p-4 border-b border-white/5 cursor-pointer overflow-hidden transition-colors hover:bg-white/[0.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      {/* 1. Background Waveform Preview */}
      <AnimatePresence>
        {isHovered && !isCurrent && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 0.2, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute inset-0 z-0 flex items-center px-4"
          >
            <div className="w-full h-8">
               <WaveformVisualizer 
                  progress={0} // Preview stays at start
                  isPlaying={false} 
                  color={track.color || '#a8ff00'}
                  playerSize={400} // This should match the container width
               />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Track Info Content */}
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center gap-4">
          <span className={`text-sm tracking-widest uppercase ${isCurrent ? 'text-[#a8ff00] font-bold' : 'text-gray-300'}`}>
            {track.title}
          </span>
          {isCurrent && (
             <div className="w-2 h-2 rounded-full bg-[#a8ff00] animate-pulse" />
          )}
        </div>
        <div className="flex items-center gap-6">
          <span className="text-[0.65rem] tracking-[0.2em] text-gray-500 uppercase hidden sm:block">
            {track.genre}
          </span>
          <span className="text-xs font-mono text-gray-400">
            {duration || "--:--"}
          </span>
        </div>
      </div>
    </div>
  );
};
