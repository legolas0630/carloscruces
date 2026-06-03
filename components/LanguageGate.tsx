"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Locale } from "@/lib/translations";

const OPTIONS: { code: Locale; display: string; region: string }[] = [
  { code: "en", display: "English", region: "Global / US" },
  { code: "es", display: "Español", region: "México / España" },
  { code: "fr", display: "Français", region: "Europe / Canada" },
  { code: "pt", display: "Português", region: "Brasil / Europa" },
  { code: "de", display: "Deutsch", region: "Europa" },
  { code: "ja", display: "日本語", region: "Japan" },
  { code: "zh", display: "简体中文", region: "China" },
  { code: "hi", display: "हिन्दी", region: "India" },
  { code: "ar", display: "العربية", region: "Middle East" },
];

export default function LanguageGate() {
  const { setLocale } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check for existing preference matrix to handle returning visitors instantly
    const hasLocaleCookie = document.cookie.split("; ").find(row => row.startsWith("NEXT_LOCALE="));
    
    if (!hasLocaleCookie) {
      setIsVisible(true);
    }
  }, []);

  const handleSelection = (code: Locale) => {
    setLocale(code);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#030303] flex flex-col items-center justify-center px-6 overflow-y-auto"
        >
          {/* ================= INTERACTIVE LIFESTYLE TV STATIC ENGINE ================= */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes gateFuzz {
              0% { background-position: 0px 0px; }
              20% { background-position: 20px 40px; }
              40% { background-position: -40px 20px; }
              60% { background-position: 30px -30px; }
              80% { background-position: -20px -20px; }
              100% { background-position: 10px 10px; }
            }
            @keyframes ambientPulse {
              0%, 100% { opacity: 0.15; transform: scale(1); }
              50% { opacity: 0.25; transform: scale(1.05); }
            }
            .animate-gate-fuzz {
              animation: gateFuzz 0.1s infinite steps(4);
            }
            .animate-ambient-pulse {
              animation: ambientPulse 4s ease-in-out infinite;
            }
          `}} />

          {/* Dynamic Background Layout Stack */}
          <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
            {/* Hypnotic Rhythmic Pulse Layer */}
            <div 
              className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#a8ff00_0%,transparent_65%)] mix-blend-screen animate-ambient-pulse" 
              style={{ filter: "blur(40px)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/90 to-[#030303]" />

            {/* Base64 Static Grain Sheet Overlay */}
            <div 
              className="absolute inset-0 animate-gate-fuzz opacity-[0.09]" 
              style={{
                backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44NSIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjM2MCUiIGZpbHRlcj0idXJsKCNuKSIvPjwvc3ZnPg==")`,
                backgroundSize: "130px 130px",
              }} 
            />
          </div>
          {/* ========================================================================= */}

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-xl text-center flex flex-col items-center relative z-10 py-12"
          >
            {/* Minimal Brand Identifier */}
            <h1 
              style={{ fontFamily: "var(--font-barlow-condensed), sans-serif" }}
              className="text-white text-3xl font-black tracking-[0.25em] uppercase mb-1 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] select-none"
            >
              CARLOS CRUCES
            </h1>
            <span className="text-[0.6rem] font-mono tracking-[0.45em] text-[#a8ff00] uppercase mb-12 font-bold select-none animate-pulse">
              Select Soundscape Context
            </span>

            {/* Language Presentation Matrix Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
              {OPTIONS.map((lang, idx) => (
                <motion.button
                  key={lang.code}
                  whileHover={{ 
                    scale: 1.03, 
                    borderColor: "rgba(168,255,0,0.25)", 
                    backgroundColor: "rgba(10,10,10,0.85)",
                    boxShadow: "0 10px 30px -15px rgba(168,255,0,0.08)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.03, duration: 0.3, ease: "easeOut" }}
                  onClick={() => handleSelection(lang.code)}
                  className="bg-[#070707]/90 border border-zinc-900/80 rounded-sm p-4 text-left transition-all duration-200 focus:outline-none group flex flex-col justify-center h-20 backdrop-blur-xs cursor-pointer"
                >
                  <span className="font-sans font-bold text-sm tracking-wide text-zinc-300 group-hover:text-white transition-colors">
                    {lang.display}
                  </span>
                  <span className="font-mono text-[0.55rem] text-zinc-600 group-hover:text-[#a8ff00]/60 transition-colors tracking-widest uppercase mt-0.5 font-medium">
                    {lang.region}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}