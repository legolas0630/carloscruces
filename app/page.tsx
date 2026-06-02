"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePlayer } from "@/lib/PlayerContext";
import VinylPlayer from "@/components/VinylPlayer";

export default function HomePage() {
  const { currentTrack, isPlaying } = usePlayer();
  const [playerSize, setPlayerSize] = useState(260);

  const grainDuration = React.useMemo(() => {
    const bpm = parseFloat(currentTrack.bpm) || 120;
    return (60 / bpm) / 4; // Sync to 1/4 beat for rhythmic high-frequency fuzz
  }, [currentTrack.bpm]);

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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20 sm:px-8 relative overflow-hidden bg-transparent">
      
      {/* ================= BULLETPROOF ANIMATED TV STATIC BACKGROUND ================= */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes analogFuzz {
          0% { background-position: 0px 0px; }
          20% { background-position: 15px 30px; }
          40% { background-position: -30px 15px; }
          60% { background-position: 45px -15px; }
          80% { background-position: -15px -45px; }
          100% { background-position: 25px 25px; }
        }
        .animate-analog-fuzz {
          animation: analogFuzz 0.12s infinite steps(5);
        }
      `}} />

      <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
        {/* Ambient Spotlight Layer (Helps illuminate the static detail underneath) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(32,32,32,0.3)_0%,rgba(7,7,7,0.7)_85%)]" />

        {/* Base64-Encoded Static Grain Sheet (Renders with 100% reliability on all devices) */}
        <div 
          className="absolute inset-0 animate-analog-fuzz transition-[animation-duration,opacity] duration-500" 
          style={{
            backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44NSIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjM2MCUiIGZpbHRlcj0idXJsKCNuKSIvPjwvc3ZnPg==")`,
            backgroundSize: "140px 140px",
            animationDuration: isPlaying ? `${grainDuration}s` : "0.12s",
            opacity: isPlaying ? 0.12 : 0.06,
          }} 
        />
      </div>
      {/* ============================================================================= */}

      <motion.div
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 1.2 }}
        className="text-center relative z-10 w-full"
      >
        {/* Hero Title with Dual-State loops (Hyper glitch when active, breathing pulse when paused) */}
        <div className="mb-2" style={{ lineHeight: 0.88, userSelect: "none" }}>
          <motion.div
            animate={{ 
              textShadow: isPlaying 
                ? ["0 0 10px #a8ff00, 2px 0 #00ffcc, -2px 0 #ff4400", "0 0 20px #a8ff00, -1px 0 #cc00ff, 1px 0 #00ffcc", "0 0 10px #a8ff00"] 
                : [
                    "0 0 15px rgba(168, 255, 0, 0.15), 0 2px 10px rgba(0,0,0,0.95)", 
                    "0 0 30px rgba(168, 255, 0, 0.45), 0 2px 10px rgba(0,0,0,0.95)", 
                    "0 0 15px rgba(168, 255, 0, 0.15), 0 2px 10px rgba(0,0,0,0.95)"
                  ] 
            }}
            transition={{ 
              duration: isPlaying ? grainDuration : 2.5, 
              repeat: Infinity, 
              repeatType: isPlaying ? "reverse" : "mirror",
              ease: isPlaying ? "linear" : "easeInOut"
            }}
            className="font-black tracking-[0.05em] text-[#a8ff00]"
            style={{ fontSize: "clamp(3.5rem, 11vw, 8rem)", fontFamily: "var(--font-barlow-condensed), sans-serif" }}
          >
            CARLOS
          </motion.div>
          
          <motion.div
            animate={{ 
              textShadow: isPlaying 
                ? ["0 0 10px #a8ff00", "0 0 25px #a8ff0088", "0 0 10px #a8ff00"] 
                : [
                    "0 2px 10px rgba(0,0,0,0.95), 0 0 0px rgba(255,255,255,0)", 
                    "0 2px 10px rgba(0,0,0,0.95), 0 0 15px rgba(255,255,255,0.08)", 
                    "0 2px 10px rgba(0,0,0,0.95), 0 0 0px rgba(255,255,255,0)"
                  ] 
            }}
            transition={{ 
              duration: isPlaying ? grainDuration * 1.5 : 3, 
              repeat: Infinity, 
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className="font-black tracking-[0.05em] text-[#f0f0f0]"
            style={{ fontSize: "clamp(3.5rem, 11vw, 8rem)", fontFamily: "var(--font-barlow-condensed), sans-serif" }}
          >
            CRUCES
          </motion.div>
        </div>

        <div 
          className="font-normal tracking-[0.6em] text-[#a8ff00] mt-3 mb-12 uppercase select-none" 
          style={{ 
            fontSize: "clamp(0.7rem, 2vw, 1rem)", 
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            textShadow: "0 2px 8px rgba(0,0,0,0.9)"
          }}
        >
          ASCEND · DESCEND · TRANSCEND
        </div>

        <div className="flex justify-center mb-8">
          <VinylPlayer size={playerSize} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentTrack.id}
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="mb-14 select-none"
          >
            <div 
              className="font-bold text-[1.4rem] tracking-[0.2em] uppercase transition-colors duration-300" 
              style={{ 
                color: currentTrack.color, 
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                textShadow: "0 2px 10px rgba(0,0,0,0.95)"
              }}
            >
              {currentTrack.title}
            </div>
            <div 
              className="font-light text-[0.8rem] text-gray-400 mt-1 tracking-[0.3em]" 
              style={{ 
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                textShadow: "0 1px 5px rgba(0,0,0,0.9)"
              }}
            >
              {currentTrack.bpm}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Main Hub Links with Isolated Glassmorphism Layers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-[460px] w-full mx-auto px-4">
          {links.map((l, i) => (
            <Link key={l.href} href={l.href} className="no-underline block w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                whileHover={{ scale: 1.02, borderColor: l.color, boxShadow: `0 0 25px ${l.color}25` }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#0b0b0b]/92 border border-white/5 rounded-sm p-5 w-full text-left cursor-pointer group transition-colors duration-300 flex flex-col justify-center h-24"
                style={{ backdropFilter: "blur(6px)" }} // Isolates text from static line distraction underneath
              >
                <div 
                  className="font-bold text-[1.2rem] tracking-[0.15em] text-[#f0f0f0] group-hover:text-white transition-colors duration-200"
                  style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", margin: 0 }}
                >
                  {l.label}
                </div>
                <div 
                  className="font-light text-[0.65rem] text-gray-400 mt-1 tracking-[0.1em] uppercase group-hover:text-white transition-colors duration-200"
                  style={{ fontFamily: "var(--font-barlow-condensed), sans-serif" }}
                >
                  {l.sub}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* High-Contrast Social Footer Links */}
        <motion.div
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.8 }}
          className="flex flex-wrap gap-8 justify-center mt-16"
        >
          {["BANDCAMP", "SOUNDCLOUD", "RA", "INSTAGRAM"].map(s => (
            <a 
              key={s} 
              href="#" 
              className="font-bold text-[0.65rem] tracking-[0.3em] text-gray-400 hover:text-[#a8ff00] no-underline transition-colors duration-200"
              style={{ 
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                textShadow: "0 2px 4px rgba(0,0,0,0.9)"
              }}
            >
              {s}
            </a>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}