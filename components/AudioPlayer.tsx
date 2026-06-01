"use client";

import React from "react";
import { motion } from "framer-motion";
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
  const { currentTrack, isPlaying, progress, volume, setVolume, toggle, skip, setProgress } = usePlayer();

  return (
    <motion.div
      initial={{ y: 100 }} animate={{ y: 0 }} transition={{ type: "spring", damping: 20 }}
      style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
        background: "rgba(10,10,10,0.97)", borderTop: "1px solid #1a1a1a",
        backdropFilter: "blur(20px)",
        display: "flex", alignItems: "center", gap: "1.5rem",
        padding: "0 2rem", height: "72px"
      }}
    >
      <div style={{ width: 44, height: 44, borderRadius: 4, overflow: "hidden", border: `1px solid ${currentTrack.color}44`, flexShrink: 0 }}>
        <img src={currentTrack.img} alt={currentTrack.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      <div style={{ minWidth: 160, flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em", color: "#f0f0f0" }}>
          {currentTrack.title}
        </div>
        <div style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 300, fontSize: "0.7rem", color: "#666", marginTop: 2 }}>
          CARLOS CRUCES · {currentTrack.bpm}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
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
      </div>

      <div style={{ flex: 1, cursor: "pointer" }}
        onClick={e => {
          const rect = e.currentTarget.getBoundingClientRect();
          setProgress(((e.clientX - rect.left) / rect.width) * 100);
        }}
      >
        <div style={{ height: 3, background: "#1a1a1a", borderRadius: 2, position: "relative" }}>
          <motion.div style={{
            height: "100%", background: `linear-gradient(90deg, ${currentTrack.color}, #a8ff00)`,
            borderRadius: 2, width: `${progress}%`, boxShadow: `0 0 8px ${currentTrack.color}`
          }} />
          <div style={{
            position: "absolute", top: "50%", transform: "translateY(-50%)",
            left: `${progress}%`, width: 10, height: 10, borderRadius: "50%",
            background: "#a8ff00", marginLeft: -5, boxShadow: "0 0 6px #a8ff00"
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontSize: "0.65rem", color: "#444", fontFamily: "var(--font-barlow-condensed), sans-serif" }}>
            {/* Displaying elapsed time based on progress and duration */}
            {/* Note: This is an approximation since we don't have the exact duration in seconds readily available from TRACKS without parsing */}
            {Math.floor(progress * 4.4 / 100)}:{String(Math.floor((progress * 4.4 / 100 % 1) * 60)).padStart(2, "0")}
          </span>
          <span style={{ fontSize: "0.65rem", color: "#444", fontFamily: "var(--font-barlow-condensed), sans-serif" }}>
            {currentTrack.duration}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
        <span style={{ color: "#666", fontSize: "0.8rem" }}>🔊</span>
        <input
          type="range" min="0" max="1" step="0.01" value={volume}
          onChange={e => setVolume(Number(e.target.value))}
          style={{
            width: 80, accentColor: "#a8ff00", cursor: "pointer",
            WebkitAppearance: "none", height: 3,
            background: `linear-gradient(to right, #a8ff00 ${volume * 100}%, #1a1a1a ${volume * 100}%)`,
            outline: "none", borderRadius: 2
          }}
        />
      </div>
    </motion.div>
  );
}
