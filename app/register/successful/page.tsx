"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePlayer } from "@/context/PlayerContext";

export default function RegisterSuccessPage() {
  const { isPlaying } = usePlayer();

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 relative overflow-hidden select-none">
      {/* Dynamic Glowing Spotlight Backing Node */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#a8ff00]/5 blur-[140px] pointer-events-none rounded-full" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[460px] text-center p-8 relative z-10"
      >
        <motion.div 
          animate={{ 
            textShadow: isPlaying 
              ? ["0 0 15px #a8ff00, 2px 0 #00ffcc", "0 0 30px #a8ff00, -2px 0 #ff4400", "0 0 15px #a8ff00"] 
              : ["0 0 20px rgba(168, 255, 0, 0.2)", "0 0 40px rgba(168, 255, 0, 0.5)", "0 0 20px rgba(168, 255, 0, 0.2)"] 
          }}
          transition={{ duration: 2.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          style={{ fontFamily: "var(--font-barlow-condensed), sans-serif" }}
          className="text-5xl sm:text-6xl font-black tracking-tighter text-[#a8ff00] mb-4 uppercase"
        >
          REGISTRATION<br />SUCCESSFUL
        </motion.div>

        <p 
          style={{ fontFamily: "var(--font-barlow), sans-serif", textShadow: "0 2px 4px rgba(0,0,0,0.9)" }}
          className="text-sm text-zinc-400 font-light tracking-[0.18em] uppercase max-w-sm mx-auto leading-relaxed mb-10"
        >
          Your baseline parameters are stored inside the core network database file system. Unlocking explicit media vaults...
        </p>

        <Link href="/login" className="no-underline inline-block">
          <motion.div
            whileHover={{ scale: 1.05, borderColor: "#a8ff00", boxShadow: "0 0 25px rgba(168,255,0,0.3)" }}
            whileTap={{ scale: 0.98 }}
            className="px-10 py-4 bg-transparent border border-white/10 text-[0.65rem] font-black tracking-[0.35em] text-white hover:text-black hover:bg-[#a8ff00] rounded-sm uppercase transition-all duration-300 shadow-xl"
          >
            ENTER THE AUDIO NETWORK
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}