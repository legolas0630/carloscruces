"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayer } from "@/lib/PlayerContext";
import { TRACKS } from "@/lib/tracks";
import VinylPlayer from "@/components/VinylPlayer";
import SectionHeader from "@/components/SectionHeader";

export default function MusicPage() {
  const { currentTrack, isPlaying, progress, play, toggle } = usePlayer();
  const [playerSize, setPlayerSize] = useState(300);
  const [activeType, setActiveType] = useState<'ALL' | 'EP' | 'Single'>('ALL');
  const [activeGenre, setActiveGenre] = useState('ALL');

  const genres = ['ALL', ...Array.from(new Set(TRACKS.map(t => t.genre)))];
  const filteredTracks = TRACKS.filter(t => 
    (activeType === 'ALL' || t.type === activeType) && 
    (activeGenre === 'ALL' || t.genre === activeGenre)
  );

  useEffect(() => {
    const handleResize = () => {
      // Use 240px for mobile, 280px for tablets, and 300px for desktop
      setPlayerSize(window.innerWidth < 480 ? 240 : window.innerWidth < 768 ? 280 : 300);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen py-24 px-4 sm:px-10 max-w-[1100px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <SectionHeader label="MUSIC" sub="DISCOGRAPHY · RELEASES" />

        {/* Filter System */}
        <div className="mt-12 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between border-b border-[#1a1a1a] pb-6">
          <div className="flex gap-4">
            {['ALL', 'EP', 'Single'].map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type as any)}
                className={`text-[0.65rem] font-bold tracking-[0.2em] transition-all ${activeType === type ? 'text-[#a8ff00]' : 'text-[#444] hover:text-[#888]'}`}
              >
                {type === 'Single' ? 'SINGLES' : type === 'EP' ? 'EPS' : 'ALL RELEASES'}
              </button>
            ))}
          </div>
          
          <div className="flex gap-3 overflow-x-auto no-scrollbar w-full sm:w-auto">
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setActiveGenre(g)}
                className={`px-3 py-1 rounded-full border text-[0.6rem] whitespace-nowrap transition-all ${
                  activeGenre === g 
                    ? 'border-[#a8ff00] text-[#a8ff00] bg-[#a8ff00]/5' 
                    : 'border-[#222] text-[#555] hover:border-[#444]'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center mt-12">
          <div className="flex flex-col items-center gap-10">
            <div className="relative py-10 w-full flex justify-center">
              <VinylPlayer size={playerSize} />
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={currentTrack.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontWeight: 900, fontSize: "1.6rem", letterSpacing: "0.15em", color: currentTrack.color }}>
                  {currentTrack.title}
                </div>
                <div style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 300, fontSize: "0.8rem", color: "#555", marginTop: 4 }}>
                  {currentTrack.desc}
                </div>
              </motion.div>
            </AnimatePresence>
            {/* Waveform visualizer */}
            <div style={{ width: "100%", height: 48, display: "flex", alignItems: "center", gap: 2 }}>
              {Array.from({ length: 60 }).map((_, i) => {
                const filled = (i / 60) * 100 < progress;
                return (
                  <motion.div
                    key={i}
                    animate={{ height: isPlaying ? `${20 + Math.random() * 26}px` : `${8 + Math.sin(i * 0.5) * 10}px` }}
                    transition={{ duration: 0.1, repeat: isPlaying ? Infinity : 0, repeatType: "mirror", delay: i * 0.01 }}
                    style={{ flex: 1, background: filled ? currentTrack.color : "#1a1a1a", borderRadius: 1, minHeight: 2, boxShadow: filled ? `0 0 4px ${currentTrack.color}` : "none" }}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontWeight: 400, fontSize: "0.7rem", letterSpacing: "0.3em", color: "#444", marginBottom: "0.5rem" }}>
              {activeGenre !== 'ALL' ? `${activeGenre} TRACKS` : 'TRACKLIST'} ({filteredTracks.length})
            </div>
            {filteredTracks.map((t, i) => {
              const active = currentTrack.id === t.id;
              return (
                <motion.div
                  key={t.id}
                  whileHover={{ x: 4 }}
                  onClick={() => active ? toggle() : play(t)}
                  style={{
                    display: "flex", alignItems: "center", gap: "1rem",
                    padding: "1rem 1.2rem", cursor: "pointer",
                    background: active ? "#111" : "transparent",
                    border: `1px solid ${active ? t.color + "44" : "#1a1a1a"}`,
                    borderRadius: 2, transition: "all 0.2s",
                    boxShadow: active ? `0 0 15px ${t.color}22` : "none"
                  }}
                >
                  <div style={{ width: 32, textAlign: "center" }}>
                    {active && isPlaying ? (
                      <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
                        <span style={{ color: t.color, fontSize: "1rem" }}>▶</span>
                      </motion.div>
                    ) : (
                      <span style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", color: "#333", fontSize: "0.8rem" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    )}
                  </div>
                  <img src={t.img} alt={t.title} style={{ width: 40, height: 40, borderRadius: 2, objectFit: "cover" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.1em", color: active ? t.color : "#f0f0f0" }}>
                      {t.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[0.6rem] px-1.5 py-0.5 rounded-sm bg-[#1a1a1a] text-[#888] font-bold">{t.type}</span>
                      <div style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 300, fontSize: "0.7rem", color: "#555" }}>
                        {t.genre} · {t.bpm}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontSize: "0.8rem", color: "#444" }}>
                    {t.duration}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Vinyl Shelf */}
        <div className="mt-24">
          <div className="mb-6 flex items-center justify-between border-b border-[#1a1a1a] pb-4">
            <div className="font-black text-xs tracking-[0.4em] text-[#444]">VINYL SHELF</div>
            <div className="text-[0.6rem] text-[#222]">SELECT RELEASE TO SWAP</div>
          </div>
          <div 
            className="relative px-6 py-12 rounded-sm overflow-hidden"
            style={{
              backgroundColor: "#0d0d0d",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='wood' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.01 0.4' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23wood)' opacity='0.12'/%3E%3C/svg%3E")`,
              boxShadow: "inset 0 0 60px rgba(0,0,0,1), 0 1px 0 rgba(255,255,255,0.03)"
            }}
          >
            <div className="flex gap-6 overflow-x-auto pb-2 no-scrollbar relative z-10">
            {filteredTracks.map((t) => (
              <motion.div
                key={t.id}
                whileHover={{ y: -10, rotateY: -10 }}
                onClick={() => play(t)}
                className="relative group shrink-0 cursor-pointer"
                style={{ perspective: 1000 }}
              >
                <div 
                  className={`w-32 h-32 sm:w-40 sm:h-40 transition-all duration-500 border ${currentTrack.id === t.id ? 'border-[#a8ff00] shadow-[0_0_30px_rgba(168,255,0,0.2)]' : 'border-white/5'}`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <img src={t.sleeveImg || t.img} alt={t.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <div className="text-[0.6rem] font-bold text-[#a8ff00] leading-tight truncate">{t.title}</div>
                    <div className="text-[0.5rem] text-white/50">{t.bpm}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
            {/* Bottom shelf ledge */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1a1a1a]"
              style={{ boxShadow: "0 -2px 12px rgba(0,0,0,0.9)" }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
