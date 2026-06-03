"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

// Lightweight cookie helper utils
const getCookie = (name: string): string => {
  if (typeof document === "undefined") return "";
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || "";
  return "";
};

const setCookie = (name: string, value: string, days = 365) => {
  if (typeof document === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;SameSite=Lax;Secure`;
};

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Check if user has already responded to the compliance protocol
    const consent = getCookie("cc_privacy_consent");
    if (!consent) {
      // Elegant 2-second telemetry delay before rendering to avoid layout shifts
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    setCookie("cc_privacy_consent", "ACCEPTED");
    setIsVisible(false);
  };

  const handleDecline = () => {
    setCookie("cc_privacy_consent", "DECLINED");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 260, damping: 25, delay: 0.1 }}
          style={{ backdropFilter: "blur(16px)" }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-[420px] bg-[#090909]/90 border border-white/5 p-6 rounded-sm shadow-2xl z-[999] font-mono select-none"
        >
          {/* Ambient Subtle Cyber Glow Strip */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#a8ff00]/40 shadow-[0_0_10px_#a8ff00]" />

          <div className="flex flex-col gap-4">
            <div>
              <div className="text-[0.55rem] tracking-[0.3em] text-[#a8ff00] font-black uppercase mb-1.5">
                // PRIVACY COMPLIANCE PROTOCOL
              </div>
              <h4 className="text-xs font-bold text-white tracking-wider uppercase mb-2">
                COOKIE & TELEMETRY ACCESS
              </h4>
              <p className="text-[0.68rem] text-zinc-400 tracking-wide leading-relaxed uppercase">
                This node utilizes performance optimization modules, secure session variables, and telemetry cookies to sync global language profiles and stream high-fidelity track masters seamlessly.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-1">
              <button
                onClick={handleDecline}
                className="py-2.5 border border-white/10 hover:border-red-500/40 text-zinc-400 hover:text-red-400 bg-white/[0.01] hover:bg-red-950/10 text-[0.62rem] font-bold tracking-[0.2em] uppercase rounded-sm transition-all duration-200 focus:outline-none"
              >
                DECLINE OPTIONAL
              </button>
              <button
                onClick={handleAccept}
                className="py-2.5 bg-[#a8ff00] hover:bg-[#baff3b] text-black text-[0.62rem] font-black tracking-[0.2em] uppercase rounded-sm shadow-[0_0_15px_rgba(168,255,0,0.15)] transition-all duration-200 focus:outline-none"
              >
                ACCEPT ALL MODULES
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}