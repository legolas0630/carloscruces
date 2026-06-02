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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20 sm:px-8 relative overflow-hidden">
      {/* Noise texture overlay */}
      <div className="fixed inset-0 z-0 opacity-0.03 pointer-events-none" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px"
        }} 
      />

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}
        className="text-center relative z-10 w-full"
      >
        {/* Hero title with glitch-shadow animation when playing */}
        <div className="mb-2" style={{ lineHeight: 0.88, userSelect: "none" }}>
          <motion.div
            animate={{ textShadow: isPlaying ? ["0 0 10px #a8ff00, 2px 0 #00ffcc, -2px 0 #ff4400", "0 0 20px #a8ff00, -1px 0 #cc00ff, 1px 0 #00ffcc", "0 0 10px #a8ff00"] : "0 0 20px #a8ff0066" }}
            transition={{ duration: 0.1, repeat: Infinity, repeatType: "reverse" }}
            className="font-black tracking-[0.05em] text-[#a8ff00]"
            style={{ fontSize: "clamp(3.5rem, 11vw, 8rem)" }}
          >
            CARLOS
          </motion.div>
          <motion.div
            animate={{ textShadow: isPlaying ? ["0 0 10px #a8ff00", "0 0 25px #a8ff0088", "0 0 10px #a8ff00"] : "none" }}
            transition={{ duration: 0.15, repeat: Infinity, repeatType: "reverse" }}
            className="font-black tracking-[0.05em] text-[#f0f0f0]"
            style={{ fontSize: "clamp(3.5rem, 11vw, 8rem)" }}
          >
            CRUCES
          </motion.div>
        </div>

        <div className="font-normal tracking-[0.6em] text-[#a8ff00] mt-3 mb-12 uppercase" style={{ fontSize: "clamp(0.7rem, 2vw, 1rem)" }}>
          ASCEND · DESCEND · TRANSCEND
        </div>

        <div className="flex justify-center mb-8">
          <VinylPlayer size={playerSize} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentTrack.id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="mb-14"
          >
            <div className="font-bold text-[1.4rem] tracking-[0.2em] uppercase" style={{ color: currentTrack.color }}>
              {currentTrack.title}
            </div>
            <div className="font-light text-[0.8rem] text-[#555] mt-1 tracking-[0.3em]">
              {currentTrack.bpm}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Main Hub Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-[460px] w-full mx-auto px-4">
          {links.map((l, i) => (
            <Link key={l.href} href={l.href} className="no-underline">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ scale: 1.03, borderColor: l.color, boxShadow: `0 0 20px ${l.color}44` }}
                whileTap={{ scale: 0.97 }}
                className="bg-[#111] border border-[#2a2a2a] rounded-sm p-5 w-full text-left transition-all duration-300"
              >
                <div className="font-bold text-[1.2rem] tracking-[0.15em] text-[#f0f0f0]">{l.label}</div>
                <div className="font-light text-[0.65rem] text-[#555] mt-1 tracking-[0.1em] uppercase">{l.sub}</div>
              </motion.button>
            </Link>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="flex flex-wrap gap-8 justify-center mt-16"
        >
          {["BANDCAMP", "SOUNDCLOUD", "RA", "INSTAGRAM"].map(s => (
            <a key={s} href="#" className="font-bold text-[0.65rem] tracking-[0.3em] text-[#333] hover:text-[#a8ff00] no-underline transition-colors duration-200">
              {s}
            </a>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}