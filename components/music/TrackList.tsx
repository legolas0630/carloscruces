"use client";

import React from "react";
import { motion } from "framer-motion";

interface TrackListProps {
  tracks: any[];
  currentTrack: any;
  isPlaying: boolean;
  durations: Record<number, string>;
  activeGenre: string;
  onTrackSelect: (track: any) => void;
  onDownloadInit: (track: any) => void;
}

export default function TrackList({
  tracks,
  currentTrack,
  isPlaying,
  durations,
  activeGenre,
  onTrackSelect,
  onDownloadInit,
}: TrackListProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Category Track Count Header Header */}
      <div 
        style={{ 
          fontFamily: "var(--font-barlow-condensed), sans-serif", 
          fontWeight: 600, 
          fontSize: "0.75rem", 
          letterSpacing: "0.3em", 
          color: "#888888", // Lifted from #444
          marginBottom: "0.75rem",
          textShadow: "0 1px 4px rgba(0,0,0,0.8)"
        }}
        className="uppercase select-none"
      >
        {activeGenre !== 'ALL' ? `${activeGenre} TRACKS` : 'TRACKLIST'} ({tracks.length})
      </div>

      {tracks.map((t, i) => {
        const active = currentTrack?.id === t.id;
        return (
          <motion.div
            key={t.id}
            whileHover={{ 
              x: 4,
              boxShadow: `0 0 20px ${t.color}33`,
              borderColor: `${t.color}66`,
              background: "rgba(22, 22, 22, 0.85)"
            }}
            onClick={() => onTrackSelect(t)}
            style={{
              display: "flex", alignItems: "center", gap: "1rem",
              padding: "1rem 1.2rem", cursor: "pointer",
              background: active ? "rgba(18, 18, 18, 0.95)" : "rgba(10, 10, 10, 0.4)",
              border: `1px solid ${active ? t.color + "55" : "rgba(255,255,255,0.06)"}`,
              borderRadius: 2, transition: "all 0.25s ease",
              boxShadow: active ? `0 0 15px ${t.color}22` : "none"
            }}
          >
            {/* Track Indices Numbers Column */}
            <div style={{ width: 32, textAlign: "center" }} className="select-none">
              {active && isPlaying ? (
                <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
                  <span style={{ color: t.color, fontSize: "0.9rem" }}>▶</span>
                </motion.div>
              ) : (
                <span 
                  style={{ 
                    fontFamily: "var(--font-barlow-condensed), sans-serif", 
                    color: active ? "#ffffff" : "#777777", // Lifted from #333 for crisp baseline readability
                    fontSize: "0.85rem",
                    fontWeight: 600
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              )}
            </div>
            
            <img src={t.img} alt={t.title} className="w-10 h-10 rounded-sm object-cover shadow-md select-none pointer-events-none" />
            
            {/* Metadata Text Layout blocks */}
            <div style={{ flex: 1 }} className="min-w-0">
              <div 
                style={{ 
                  fontFamily: "var(--font-barlow-condensed), sans-serif", 
                  fontWeight: 700, 
                  fontSize: "1.05rem", 
                  letterSpacing: "0.08em", 
                  color: active ? t.color : "#ffffff",
                  textShadow: "0 2px 4px rgba(0,0,0,0.9)"
                }}
                className="truncate uppercase"
              >
                {t.title}
              </div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                {/* Release Type Badge Tag */}
                <span className="text-[0.55rem] px-2 py-0.5 rounded-sm bg-white/10 text-white font-extrabold tracking-wider select-none">
                  {t.type}
                </span>
                
                {/* Genre & BPM Tag Strings */}
                <div 
                  style={{ 
                    fontFamily: "var(--font-barlow), sans-serif", 
                    fontWeight: 400, 
                    fontSize: "0.72rem", 
                    color: "#c0c0c0", // Lifted from muddy dark #555 to clear metallic light gray
                    letterSpacing: "0.05em",
                    textShadow: "0 1px 4px rgba(0,0,0,0.9)"
                  }}
                  className="truncate uppercase"
                >
                  {t.genre} · {t.bpm}
                </div>
              </div>
            </div>
            
            {/* Right Action Tools Column */}
            <div className="flex items-center gap-5">
              <motion.button
                whileHover={{ color: t.color, scale: 1.15 }}
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onDownloadInit(t); 
                }}
                className="text-gray-400 hover:text-white transition-colors p-1" // Lifted from invisible #333
                title="Download"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </svg>
              </motion.button>
              
              {/* Audio Total Track Duration Strings */}
              <div 
                style={{ 
                  fontFamily: "var(--font-barlow-condensed), sans-serif", 
                  fontSize: "0.85rem", 
                  color: active ? "#ffffff" : "#a2a2a2", // Lifted from invisible dark #444 to high visibility gray
                  minWidth: "40px", 
                  textAlign: "right",
                  fontWeight: 500,
                  textShadow: "0 1px 4px rgba(0,0,0,0.8)"
                }}
              >
                {durations[t.id] || "..."}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}