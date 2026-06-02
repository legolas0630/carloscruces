"use client";

import React from 'react';
import { motion } from 'framer-motion';

const WaveformVisualizer = React.memo(({ progress, isPlaying, onSeek, color }: any) => {
  const updateProgress = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    onSeek((x / rect.width) * 100);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    updateProgress(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return; // Only scrub if the primary button/finger is held down
    updateProgress(e);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div 
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="w-full h-12 flex items-center gap-1 cursor-pointer touch-none"
    >
      {Array.from({ length: 80 }).map((_, i) => {
        const filled = (i / 80) * 100 < progress;
        return (
          <motion.div
            key={i}
            animate={{
              height: isPlaying ? [`${15 + Math.random() * 10}px`, `${30 + Math.random() * 15}px`, `${15 + Math.random() * 10}px`] : "10px",
              background: filled ? color : "#1a1a1a",
              boxShadow: filled && isPlaying ? `0 0 10px ${color}66` : "none"
            }}
            transition={{ 
              height: { duration: 0.15, repeat: isPlaying ? Infinity : 0, repeatType: "mirror", delay: i * 0.01 },
              background: { duration: 0.2, ease: "linear" }
            }}
            className="flex-1 rounded-sm min-h-[4px]"
          />
        );
      })}
    </div>
  );
});

WaveformVisualizer.displayName = 'WaveformVisualizer';
export default WaveformVisualizer;