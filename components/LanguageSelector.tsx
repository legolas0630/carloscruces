"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Locale } from "@/lib/translations";

interface LanguageOption {
  code: Locale;
  label: string;
  flagCode: string; // 🟢 Country code target mapping for cross-platform vector SVGs
}

const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "EN", flagCode: "us" },
  { code: "es", label: "ES", flagCode: "mx" },
  { code: "fr", label: "FR", flagCode: "fr" },
  { code: "pt", label: "PT", flagCode: "br" },
  { code: "de", label: "DE", flagCode: "de" },
  { code: "ja", label: "JA", flagCode: "jp" },
  { code: "zh", label: "ZH", flagCode: "cn" },
  { code: "hi", label: "HI", flagCode: "in" },
  { code: "ar", label: "AR", flagCode: "sa" },
];

export default function LanguageSelector() {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeLanguage = LANGUAGES.find((l) => l.code === locale) || LANGUAGES[0];

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isOpen]);

  const handleLanguageChange = (code: Locale) => {
    setLocale(code);
    localStorage.setItem("cc_language_gate_dismissed", "true");
    document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=31536000; SameSite=Lax; Secure`;
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative inline-block select-none font-mono z-50">
      
      {/* Primary Trigger Button Box */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-transparent border border-white/10 hover:border-[#a8ff00] text-zinc-300 hover:text-white px-3 py-1 rounded-sm cursor-pointer outline-none transition-all duration-200 flex items-center gap-2 text-xs font-bold tracking-widest uppercase transform-gpu focus:outline-none"
        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
      >
        {/* 🟢 High-res vector flag image replacement handles Windows machines cleanly */}
        <img 
          src={`https://flagcdn.com/w20/${activeLanguage.flagCode}.png`} 
          alt=""
          className="w-4 h-auto object-contain unselectable filter saturate-[0.8] contrast-[1.1]" 
        />
        <span>{activeLanguage.label}</span>
        <motion.span 
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[9px] text-zinc-500"
        >
          ▼
        </motion.span>
      </button>

      {/* Floating Panel Drawer Wrapper */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-32 bg-[#0a0a0c]/98 border border-zinc-800 rounded-sm p-1 shadow-[0_10px_25px_rgba(0,0,0,0.8)] backdrop-blur-md overflow-hidden transform-gpu"
          >
            <div className="flex flex-col gap-0.5 max-h-56 overflow-y-auto scrollbar-none">
              {LANGUAGES.map((lang) => {
                const isSelected = lang.code === locale;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full px-3 py-2 text-left text-xs font-bold tracking-wider rounded-xs transition-colors duration-150 flex items-center justify-between group focus:outline-none cursor-pointer ${
                      isSelected 
                        ? "bg-[#a8ff00]/5 text-[#a8ff00]" 
                        : "bg-transparent text-zinc-400 hover:bg-zinc-900/60 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img 
                        src={`https://flagcdn.com/w20/${lang.flagCode}.png`} 
                        alt="" 
                        className="w-4 h-auto object-contain filter saturate-[0.8]"
                      />
                      <span>{lang.label}</span>
                    </div>
                    
                    {isSelected && (
                      <span className="w-1 h-1 rounded-full bg-[#a8ff00] animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}