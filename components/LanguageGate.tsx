"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Locale } from "@/lib/translations";

const OPTIONS: { code: Locale; display: string; region: string; flagCode: string }[] = [
  { code: "en", display: "EN", region: "Global", flagCode: "us" },
  { code: "es", display: "ES", region: "México", flagCode: "mx" },
  { code: "fr", display: "FR", region: "Europe", flagCode: "fr" },
  { code: "pt", display: "PT", region: "Brasil", flagCode: "br" },
  { code: "de", display: "DE", region: "Europa", flagCode: "de" },
  { code: "ja", display: "JA", region: "Japan", flagCode: "jp" },
  { code: "zh", display: "ZH", region: "China", flagCode: "cn" },
  { code: "hi", display: "HI", region: "India", flagCode: "in" },
  { code: "ar", display: "AR", region: "M-East", flagCode: "sa" },
];

export default function LanguageGate() {
  const { setLocale } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const gateDismissed = localStorage.getItem("cc_language_gate_dismissed");
      const hasLocaleCookie = document.cookie.split("; ").find(row => row.startsWith("NEXT_LOCALE="));
      
      if (!gateDismissed && !hasLocaleCookie) {
        setIsVisible(true);
      }
    }
  }, []);

  const handleSelection = (code: Locale) => {
    setLocale(code);
    localStorage.setItem("cc_language_gate_dismissed", "true");
    document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=31536000; SameSite=Lax; Secure`;
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className="fixed bottom-6 right-6 z-[9999] w-[calc(100vw-3rem)] max-w-sm sm:max-w-md bg-[#09090b]/95 border border-zinc-800/80 rounded-sm p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] backdrop-blur-xl font-mono text-zinc-400 select-none transform-gpu"
        >
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes gateToastFuzz {
              0% { background-position: 0px 0px; }
              50% { background-position: 10px 20px; }
              100% { background-position: -10px -10px; }
            }
            .animate-gate-toast-fuzz {
              animation: gateToastFuzz 0.2s infinite steps(3);
            }
          `}} />

          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.03] animate-gate-toast-fuzz rounded-sm"
            style={{
              backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44NSIgbnVtT2N0YXZlcz0iI24iIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgibikiLz48L3N2Zz4=")`,
              backgroundSize: "100px 100px"
            }}
          />

          <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4 relative z-10">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a8ff00] animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-white uppercase">SYS_LOCALE_CONTEXT</span>
            </div>
            <span className="text-[8px] text-zinc-600 tracking-widest">v1.0.4 // DISMISS_ON_CLICK</span>
          </div>

          <p className="text-[11px] text-zinc-500 leading-relaxed mb-4 tracking-wide relative z-10">
            Select your preferred display translation index matrix layer to calibrate terminal text strings across the archive network nodes.
          </p>

          <div className="grid grid-cols-3 gap-1.5 relative z-10">
            {OPTIONS.map((lang) => (
              <motion.button
                key={lang.code}
                onClick={() => handleSelection(lang.code)}
                whileHover={{ 
                  scale: 1.02,
                  borderColor: "#a8ff00",
                  backgroundColor: "rgba(168,255,0,0.03)"
                }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#0e0e11] border border-zinc-900 rounded-xs py-2 px-3 text-left transition-colors duration-150 flex flex-col justify-center h-12 cursor-pointer focus:outline-none group transform-gpu"
              >
                <div className="flex items-center gap-2">
                  {/* 🟢 Vector SVG replacement for cross-platform compliance */}
                  <img 
                    src={`https://flagcdn.com/w20/${lang.flagCode}.png`} 
                    alt="" 
                    className="w-4 h-auto object-contain filter saturate-[0.8]"
                  />
                  <span className="font-sans font-bold text-sm tracking-wide text-zinc-300 group-hover:text-white transition-colors">
                    {lang.display}
                  </span>
                </div>
                <span className="text-[7px] text-zinc-600 group-hover:text-[#a8ff00]/70 transition-colors tracking-widest uppercase mt-0.5">
                  {lang.region}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}