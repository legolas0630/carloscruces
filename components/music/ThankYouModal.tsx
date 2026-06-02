"use client";

import React from "react";
import { motion } from "framer-motion";

interface ThankYouModalProps {
  showThankYou: boolean;
  isPlaying: boolean;
  grainDuration: number;
  onClose: () => void;
}

export default function ThankYouModal({ showThankYou, isPlaying, grainDuration, onClose }: ThankYouModalProps) {
  if (!showThankYou) return null;

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-[400px] text-center"
      >
        <motion.div 
          animate={{ 
            textShadow: isPlaying 
              ? ["0 0 10px #a8ff00, 2px 0 #00ffcc, -2px 0 #ff4400", "0 0 20px #a8ff00, -1px 0 #cc00ff, 1px 0 #00ffcc", "0 0 10px #a8ff00"] 
              : ["0 0 15px rgba(168, 255, 0, 0.15), 0 2px 10px rgba(0,0,0,0.3)", "0 0 30px rgba(168, 255, 0, 0.45), 0 2px 10px rgba(0,0,0,0.3)", "0 0 15px rgba(168, 255, 0, 0.15), 0 2px 10px rgba(0,0,0,0.3)"] 
          }}
          transition={{ 
            duration: isPlaying ? grainDuration : 2.5, 
            repeat: Infinity, 
            repeatType: isPlaying ? "reverse" : "mirror",
            ease: isPlaying ? "linear" : "easeInOut"
          }}
          className="text-5xl font-black tracking-tighter text-[#a8ff00] mb-4"
        >
          THANK YOU
        </motion.div>
        <p className="text-sm text-gray-400 font-light tracking-[0.2em] uppercase mb-8">Your support keeps the frequencies alive.</p>
        <button 
          onClick={onClose}
          className="px-8 py-3 border border-white/10 text-[0.6rem] tracking-[0.4em] text-white hover:bg-white hover:text-black transition-all rounded-sm uppercase font-bold"
        >
          Return to soundscape
        </button>
      </motion.div>
    </div>
  );
}