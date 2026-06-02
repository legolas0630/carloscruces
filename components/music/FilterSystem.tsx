"use client";

import React from "react";
import { motion } from "framer-motion";

interface FilterSystemProps {
  activeType: string;
  activeGenre: string;
  genres: string[];
  updateURLParams: (key: string, value: string) => void;
  onOpenLifetimePass: () => void;
  onOpenEPDownload: () => void;
}

export default function FilterSystem({
  activeType,
  activeGenre,
  genres,
  updateURLParams,
  onOpenLifetimePass,
  onOpenEPDownload,
}: FilterSystemProps) {
  return (
    <div className="mt-12 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between border-b border-white/5 pb-6 relative z-20">
      <div className="flex gap-4 items-center flex-wrap">
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(168,255,0,0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenLifetimePass}
          className="px-4 py-1.5 bg-[#a8ff00] text-black text-[0.7rem] font-black tracking-[0.2em] rounded-sm mr-2 flex items-center gap-2 shadow-lg"
        >
          <span className="text-xs font-sans">∞</span> LIFETIME PASS
        </motion.button>
        
        <div className="flex gap-5 bg-black/40 px-4 py-1.5 rounded-sm border border-white/5 backdrop-blur-sm">
          {['ALL', 'EP', 'Single'].map((type) => (
            <button
              key={type}
              onClick={() => updateURLParams('type', type)}
              className={`text-[0.68rem] font-black tracking-[0.2em] uppercase transition-colors duration-200 style-text-shadow ${
                activeType === type 
                  ? 'text-[#a8ff00]' 
                  : 'text-gray-400 hover:text-white' // Lifted inactive text from #444 to bright slate gray
              }`}
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
            >
              {type === 'Single' ? 'SINGLES' : type === 'EP' ? 'EPS' : 'ALL'}
            </button>
          ))}
        </div>
        
        {activeType === 'EP' && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onOpenEPDownload}
            className="px-3 py-1.5 bg-[#a8ff00] text-black text-[0.6rem] font-black tracking-widest rounded-sm ml-2 shadow-md"
          >
            DOWNLOAD FULL EP
          </motion.button>
        )}
      </div>
      
      {/* Category Horizontal Pill Row Scroller */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => updateURLParams('genre', g)}
            className={`px-3 py-1 rounded-full border text-[0.62rem] font-bold tracking-wider uppercase whitespace-nowrap transition-all duration-200 ${
              activeGenre === g 
                ? 'border-[#a8ff00] text-[#a8ff00] bg-[#a8ff00]/10 shadow-[0_0_12px_rgba(168,255,0,0.15)]' 
                : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20 hover:text-white' // Lifted from dark outlines to metallic pills
            }`}
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
          >
            {g}
          </button>
        ))}
      </div>
    </div>
  );
}