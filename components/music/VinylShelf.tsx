"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { usePlayer } from "@/context/PlayerContext"; // FIX: Capitalized to match your exact file name
import { TRACKS } from "@/lib/tracks";

interface VinylShelfProps {
  size?: number;
}

export default function VinylShelf({ size = 300 }: VinylShelfProps) {
  const { currentTrack, isPlaying, play } = usePlayer();
  const { t } = useLanguage();

  // Defensive check: Filters out duplicate entries to show unique album images safely
  const uniqueReleases = Array.from(new Set((TRACKS || []).map(t => t?.img).filter(Boolean)))
    .map(img => TRACKS.find(t => t?.img === img));

  return (
    <div className="w-full mt-6">
    {/* Replace the old header div inside components/music/VinylShelf.tsx with this */}
<div className="flex items-center justify-between border-b border-white/5 pb-2 mb-6">
  <div 
    style={{ 
      fontFamily: "var(--font-barlow-condensed), sans-serif",
      fontSize: "0.68rem", 
      color: "#9e9e9e", // Lifted from muddy dark #444 to crisp silver-grey
      letterSpacing: "0.35em",
      textShadow: "0 1px 5px rgba(0,0,0,0.9)" // Safety barrier against background static
    }}
    className="font-bold uppercase select-none"
  >
    {t("music_shelf_select")}
  </div>
</div>

      {/* Interactive Horizontal Record Row */}
      <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar relative z-10 snap-x justify-center">
        {uniqueReleases.map((t) => {
          if (!t) return null;
          const isActive = currentTrack?.img === t.img; // FIX: Added optional chaining safeguard

          return (
            <motion.div
              key={t.id}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => play(t)}
              className="relative group shrink-0 cursor-pointer snap-center"
              style={{ perspective: 1000 }}
            >
              {/* Cover Sleeve Frame */}
              <div 
                className="w-32 h-32 sm:w-40 sm:h-40 transition-all duration-300 border bg-[#111] overflow-hidden rounded-sm relative z-10 shadow-xl"
                style={{ 
                  borderColor: isActive ? (currentTrack?.color || '#a8ff00') : "rgba(255,255,255,0.05)" 
                }}
              >
                <img 
                  src={t.img} 
                  alt={t.title} 
                  className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90" 
                />
                
                {/* Information Overlay Shading */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex flex-col justify-end">
                  <div className="font-bold text-[0.65rem] text-[#a8ff00] tracking-wider leading-tight truncate uppercase">
                    {t.title}
                  </div>
                  <div className="text-[0.55rem] text-white/50 tracking-widest font-mono mt-0.5">
                    {t.genre}
                  </div>
                </div>
              </div>

              {/* Decorative Sliding Vinyl Disc Core Peek Effect */}
              <motion.div 
                animate={{ x: isActive && isPlaying ? 24 : 8 }}
                className="absolute inset-0 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-[#080808] border border-white/5 -z-10 shadow-md flex items-center justify-center pointer-events-none"
                style={{
                  background: `radial-gradient(circle, #000 15%, #111 25%, #050505 30%, #151515 55%, #000 70%)`
                }}
              >
                <div className="w-10 h-10 rounded-full border border-white/5 opacity-20" />
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}