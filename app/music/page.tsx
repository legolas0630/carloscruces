"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayer } from "@/lib/PlayerContext";
import { TRACKS } from "@/lib/tracks";
import VinylPlayer from "@/components/VinylPlayer";
import SectionHeader from "@/components/SectionHeader";

export default function MusicPage() {
  const { currentTrack, isPlaying, progress, play, toggle } = usePlayer();

  return (
    <div style={{ minHeight: "100vh", padding: "100px 2.5rem 100px", maxWidth: 1100, margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <SectionHeader label="MUSIC" sub="DISCOGRAPHY · RELEASES" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "3rem", alignItems: "start", marginTop: "3rem" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
            <VinylPlayer size={300} />
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

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontWeight: 400, fontSize: "0.7rem", letterSpacing: "0.3em", color: "#444", marginBottom: "0.5rem" }}>
              TRACKLIST
            </div>
            {TRACKS.map((t, i) => {
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
                    <div style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 300, fontSize: "0.7rem", color: "#555", marginTop: 2 }}>
                      {t.bpm}
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
      </motion.div>
    </div>
  );
}
