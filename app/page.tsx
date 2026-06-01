"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePlayer } from "@/lib/PlayerContext";
import VinylPlayer from "@/components/VinylPlayer";

export default function HomePage() {
  const { currentTrack, isPlaying } = usePlayer();
  const [playerSize, setPlayerSize] = useState(260);

  useEffect(() => {
    const handleResize = () => {
      // Use 200px for mobile to ensure it fits alongside hero text, 260px for desktop
      setPlayerSize(window.innerWidth < 480 ? 200 : 260);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const links = [
    { label: "MUSIC", sub: "4 TRACKS · UNDERGROUND TECHNO", href: "/music", color: "#a8ff00" },
    { label: "VISUALS", sub: "GRAPHIC DESIGN · ART DIRECTION", href: "/visuals", color: "#00ffcc" },
    { label: "EXPEDITIONS", sub: "HIKING · MEDITATION · JOURNAL", href: "/expeditions", color: "#ff4400" },
    { label: "MERCH", sub: "GEAR · APPAREL · LIMITED DROPS", href: "/merch", color: "#cc00ff" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20 sm:px-8">
      {/* Noise texture */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px", pointerEvents: "none"
      }} />

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}
        style={{ textAlign: "center", position: "relative", zIndex: 1 }}
      >
        {/* Two-line hero title */}
        <div style={{ lineHeight: 0.88, userSelect: "none", marginBottom: "0.5rem" }}>
          <motion.div
            animate={{ textShadow: isPlaying ? ["0 0 10px #a8ff00, 2px 0 #00ffcc, -2px 0 #ff4400", "0 0 20px #a8ff00, -1px 0 #cc00ff, 1px 0 #00ffcc", "0 0 10px #a8ff00"] : "0 0 20px #a8ff0066" }}
            transition={{ duration: 0.1, repeat: Infinity, repeatType: "reverse" }}
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif", fontWeight: 900,
              fontSize: "clamp(3.5rem, 11vw, 8rem)", letterSpacing: "0.05em",
              color: "#a8ff00",
            }}
          >
            CARLOS
          </motion.div>
          <motion.div
            animate={{ textShadow: isPlaying ? ["0 0 10px #a8ff00", "0 0 25px #a8ff0088", "0 0 10px #a8ff00"] : "none" }}
            transition={{ duration: 0.15, repeat: Infinity, repeatType: "reverse" }}
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif", fontWeight: 900,
              fontSize: "clamp(3.5rem, 11vw, 8rem)", letterSpacing: "0.05em",
              color: "#f0f0f0",
            }}
          >
            CRUCES
          </motion.div>
        </div>

        <div style={{
          fontFamily: "var(--font-barlow-condensed), sans-serif", fontWeight: 400,
          fontSize: "clamp(0.7rem, 2vw, 1rem)", letterSpacing: "0.6em",
          color: "#a8ff00", marginTop: "0.75rem", marginBottom: "3rem"
        }}>
          ASCEND · DESCEND · TRANSCEND
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
          <VinylPlayer size={playerSize} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentTrack.id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ marginBottom: "3.5rem" }}
          >
            <div style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontWeight: 700, fontSize: "1.4rem", letterSpacing: "0.2em", color: currentTrack.color }}>
              {currentTrack.title}
            </div>
            <div style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 300, fontSize: "0.8rem", color: "#555", marginTop: 4 }}>
              {currentTrack.bpm} · {currentTrack.duration}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Linktree grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-[460px] w-full mx-auto">
          {links.map((l, i) => (
            <Link key={l.href} href={l.href} style={{ textDecoration: "none" }}>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ scale: 1.03, borderColor: l.color, boxShadow: `0 0 20px ${l.color}44` }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: "#111", border: `1px solid #2a2a2a`,
                  borderRadius: 2, padding: "1.2rem 1rem", cursor: "pointer",
                  textAlign: "left", transition: "border-color 0.3s, box-shadow 0.3s",
                  width: "100%", height: "100%"
                }}
              >
                <div style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontWeight: 700, fontSize: "1.2rem", letterSpacing: "0.15em", color: "#f0f0f0" }}>
                  {l.label}
                </div>
                <div style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 300, fontSize: "0.65rem", color: "#555", marginTop: 4, letterSpacing: "0.05em" }}>
                  {l.sub}
                </div>
              </motion.button>
            </Link>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="flex flex-wrap gap-6 sm:gap-8 justify-center mt-12"
        >
          {["BANDCAMP", "SOUNDCLOUD", "RA", "INSTAGRAM"].map(s => (
            <motion.a
              key={s} href="#"
              whileHover={{ color: "#a8ff00", textShadow: "0 0 10px #a8ff00" }}
              style={{
                fontFamily: "var(--font-barlow-condensed), sans-serif", fontWeight: 600,
                fontSize: "0.75rem", letterSpacing: "0.2em", color: "#444",
                textDecoration: "none", transition: "color 0.2s"
              }}
            >
              {s}
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
