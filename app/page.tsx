"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePlayer } from "@/context/PlayerContext";
import { useLanguage } from "@/context/LanguageContext";
import VinylPlayer from "@/components/VinylPlayer";

interface LinkItem {
  label: string;
  sub: string;
  href: string;
  color: string;
  external?: boolean;
}

export default function HomePage() {
  // Destructure the optimized toggle action from our unified audio context
  const { currentTrack, isPlaying, toggle } = usePlayer();
  const { t, locale } = useLanguage();
  const [playerSize, setPlayerSize] = useState(260);
  const [isMobile, setIsMobile] = useState(false); // Tracks mobile/touch profiles to bypass thermal bottlenecks

  // Safeguarded tempo parsing to drive the synchronization matrices
  const grainDuration = useMemo(() => {
    return 60 / 128 / 4;
  }, []);

  const pulseDuration = useMemo(() => {
    return 60 / 128;
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setPlayerSize(width < 480 ? 200 : 260);
      
      // Classify mobile performance layout rules via width or hardware touch pointers
      const mobileQuery = window.matchMedia("(pointer: coarse)").matches || width < 768;
      setIsMobile(mobileQuery);
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Optimized Playback Engine Interceptor
  const handleVinylClick = () => {
    toggle();
  };

  // Reactive layout grid - hot-swaps language text streams instantly upon language toggle
  const links: LinkItem[] = useMemo(() => [
    { 
      label: t("home_music_label"), 
      sub: t("home_music_sub"), 
      href: "/music", 
      color: "#a8ff00" 
    },
    { 
      label: t("home_visuals_label"), 
      sub: t("home_visuals_sub"), 
      href: "https://xiwame.space", 
      color: "#00ffcc", 
      external: true 
    },
    { 
      label: t("home_expeditions_label"), 
      sub: t("home_expeditions_sub"), 
      href: "/expeditions", 
      color: "#ff4400" 
    },
    { 
      label: t("home_merch_label"), 
      sub: t("home_merch_sub"), 
      href: "/merch", 
      color: "#cc00ff" 
    },
  ], [t, locale]);

  const socials = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/carlos.cruces.18/",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/vulnerabilityenthusiast/",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0 3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      )
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/@expandinggroove",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31.036 2.584.37 3.75.967V7.16a5.572 5.572 0 0 1-2.766-1.503v7.915c0 3.866-3.134 7-7 7s-7-3.134-7-7 3.134-7 7-7c.18 0 .356.007.53.02V9.66c-.173-.013-.35-.02-.53-.02a4.42 4.42 0 0 0 0 8.84c2.441 0 4.42-1.979 4.42-4.42V.02h1.596z"/>
        </svg>
      )
    },
    {
      name: "X",
      href: "https://x.com/VulnerableMente",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zM17.61 20.644h2.039L6.486 3.24H4.298l13.312 17.404z"/>
        </svg>
      )
    },
    {
      name: "Bandcamp",
      href: "https://carlosfcruces.bandcamp.com/?from=viewsite_dashboard",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M0 21h14.766L24 3H9.234z"/>
        </svg>
      )
    },
    {
      name: "SoundCloud",
      href: "https://soundcloud.com/carlos-cruces-1",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M11.56 8.87c0-.15.03-.3.08-.43.1-.28.34-.49.65-.54.12-.02.24-.01.36.03.1.03.2.09.28.17l.02.02.43.46c.1.1.23.16.38.16.12 0 .23-.04.32-.11l.24-.19c.17-.14.28-.34.32-.56.03-.17.01-.35-.06-.51-.1-.23-.29-.41-.53-.48-.28-.09-.58-.06-.84.07l-.23.12c-.14.07-.3.09-.45.06a.813.813 0 0 1-.5-.39c-.08-.14-.11-.3-.08-.46.04-.24.19-.45.41-.55.15-.07.32-.08.48-.04.14.03.28.11.37.22l.14.16c.07.08.17.13.28.13.08 0 .16-.03.23-.08l.51-.37c.1-.07.17-.18.2-.3.03-.12.01-.24-.05-.35a.81.81 0 0 0-.68-.42c-.22-.01-.44.07-.61.22l-.1.09c-.11.1-.27.14-.42.11a.82.82 0 0 1-.58-.51c-.05-.2-.01-.41.1-.58.12-.18.32-.29.54-.3.14 0 .28.04.4.11l.4.24c.08.05.17.07.26.07.14 0 .26-.06.35-.16l.24-.29c.14-.17.2-.39.18-.61a.822.822 0 0 0-.49-.71c-.26-.11-.56-.1-.8.03l-.4.22c-.11.06-.23.08-.35.06a.541.541 0 0 1-.39-.33c-.05-.12-.06-.24-.02-.36.05-.16.17-.29.33-.35.12-.04.24-.04.36-.01l.4.1c.21.05.43-.01.59-.15.17-.15.25-.37.22-.59a.833.833 0 0 0-.58-.69 2.502 2.502 0 0 0-3.08 1.45l-.04.1c-.05.14-.16.25-.3.3-.14.05-.3.03-.43-.05a2.477 2.477 0 0 0-2.81-.07c-.4.24-.72.58-.93.99l-.05.1c-.06.13-.18.22-.32.25-.14.03-.29-.02-.39-.12a2.483 2.483 0 0 0-3.11-.2c-.44.3-.77.72-.94 1.22l-.02.05c-.06.14-.18.23-.33.25-.14.01-.28-.04-.37-.15a2.52 2.52 0 0 0-1.92-.85c-.69 0-1.35.27-1.84.77-.49.49-.76 1.15-.76 1.84v7.35c0 .69.27 1.35.76 1.84.49.49 1.15.77 1.84.77h13.48c.84 0 1.65-.33 2.25-.93.6-.6.93-1.41.93-2.25v-3.06c0-.84-.33-1.65-.93-2.25a3.153 3.153 0 0 0-2.25-.93z"/>
        </svg>
      )
    },
    {
      name: "Spotify",
      href: "#",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.5 17.3c-.2.3-.5.4-.8.2-2.8-1.7-6.2-2.1-10.3-1.2-.3.1-.6-.1-.7-.4-.1-.3.1-.6.4-.7 4.5-1 8.3-.5 11.4 1.4.2.1.3.4.1.7zm1.5-3.3c-.3.4-.8.5-1.2.2-3.1-1.9-7.9-2.5-11.6-1.4-.4.1-.9-.1-1-.6-.1-.4.1-.9.6-1 4.2-1.3 9.6-.6 13.2 1.6.4.3.5.8.2 1.2zm.1-3.4C15.2 8.3 8.6 8 4.8 9.2c-.5.2-1.1-.1-1.3-.6-.2-.5.1-1.1.6-1.3 4.3-1.3 11.7-1 16 1.5.5.3.6.9.3 1.4-.3.5-.9.6-1.4.3z"/>
        </svg>
      )
    }
  ];

  return (
    // 🟢 Changed from overflow-hidden to overflow-y-auto + justify-between to unlock scrolling mechanics seamlessly
    <div className="min-h-screen flex flex-col justify-between px-4 pt-28 pb-8 relative overflow-y-auto overflow-x-hidden bg-transparent transform-gpu">
      
      {/* ================= BULLETPROOF HARDWARE-ACCELERATED ANIMATIONS ================= */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes analogFuzz {
          0% { background-position: 0px 0px; }
          20% { background-position: 15px 30px; }
          40% { background-position: -30px 15px; }
          60% { background-position: 45px -15px; }
          80% { background-position: -15px -45px; }
          100% { background-position: 25px 25px; }
        }
        
        /* Isolated native keyframes bypass React telemetry re-renders entirely */
        @keyframes carlosGlitch {
          0%, 100% { text-shadow: 0 0 10px #a8ff00, 2px 0 #00ffcc, -2px 0 #ff4400; }
          50% { text-shadow: 0 0 20px #a8ff00, -1px 0 #cc00ff, 1px 0 #00ffcc; }
        }
        @keyframes crucesGlitch {
          0%, 100% { text-shadow: 0 0 10px #a8ff00; }
          50% { text-shadow: 0 0 25px #a8ff0088; }
        }
        @keyframes textAmbient {
          0%, 100% { text-shadow: 0 0 15px rgba(168, 255, 0, 0.15), 0 2px 10px rgba(0,0,0,0.95); }
          50% { text-shadow: 0 0 30px rgba(168, 255, 0, 0.45), 0 2px 10px rgba(0,0,0,0.95); }
        }
        @keyframes crucesAmbient {
          0%, 100% { text-shadow: 0 2px 10px rgba(0,0,0,0.95), 0 0 0px rgba(255,255,255,0); }
          50% { text-shadow: 0 2px 10px rgba(0,0,0,0.95), 0 0 15px rgba(255,255,255,0.08); }
        }
        @keyframes mobilePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }

        .animate-analog-fuzz {
          animation: analogFuzz 0.12s infinite steps(5);
        }
      `}} />

      <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
        {/* Ambient Spotlight Layer */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(32,32,32,0.3)_0%,rgba(7,7,7,0.7)_85%)]" />
        <div 
          className="absolute inset-0 transition-all duration-1000" 
          style={{
            background: isPlaying 
              ? `radial-gradient(circle at 50% 45%, ${(currentTrack?.color || '#a8ff00')}15 0%, rgba(7,7,7,0.85) 85%)`
              : `radial-gradient(circle at 50% 45%, rgba(32,32,32,0.3) 0%, rgba(7,7,7,0.7) 85%)`
          }}
        />

        {/* Base64 Grain Overlay Frame */}
        <div 
          className="absolute inset-0 animate-analog-fuzz transition-[animation-duration,opacity] duration-500" 
          style={{
            backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44NSIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9Ij3M2MCUiIGZpbHRlcj0idXJsKCNuKSIvPjwvc3ZnPg==")`,
            backgroundSize: "140px 140px",
            animationDuration: isPlaying ? (isMobile ? "0.4s" : `${grainDuration}s`) : (isMobile ? "0.8s" : "0.12s"),
            opacity: isPlaying ? (isMobile ? 0.06 : 0.12) : (isMobile ? 0.03 : 0.06),
          }} 
        />
      </div>

      {/* 🟢 Flex Grow Container encapsulates items cleanly without squeezing into the sticky footer zone */}
      <motion.div
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 1.2 }}
        className="flex-grow flex flex-col items-center justify-center text-center relative z-10 w-full py-4 will-change-transform"
      >
        {/* Main Brand Title Frame */}
        <div className="mb-2" style={{ lineHeight: 0.88, userSelect: "none" }}>
          {/* CARLOS: Executing via background CSS handles high-frequency rendering perfectly */}
          <div
            className="font-black tracking-[0.05em] text-[#a8ff00] transform-gpu"
            style={{ 
              fontSize: "clamp(3.5rem, 11vw, 8rem)", 
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              animation: isMobile 
                ? (isPlaying ? "mobilePulse 1.5s infinite ease-in-out" : "none")
                : (isPlaying ? `carlosGlitch ${grainDuration}s infinite linear` : "textAmbient 2.5s infinite ease-in-out"),
              textShadow: isMobile ? "0 2px 10px rgba(168, 255, 0, 0.4)" : undefined
            }}
          >
            CARLOS
          </div>
          
          {/* CRUCES: Offloaded completely to hardware threads to avoid stalling */}
          <div
            className="font-black tracking-[0.05em] text-[#f0f0f0] transform-gpu"
            style={{ 
              fontSize: "clamp(3.5rem, 11vw, 8rem)", 
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              animation: isMobile 
                ? "none"
                : (isPlaying ? `crucesGlitch ${grainDuration}s infinite linear` : "crucesAmbient 3s infinite ease-in-out"),
              textShadow: isMobile ? "0 2px 10px rgba(0,0,0,0.95)" : undefined
            }}
          >
            CRUCES
          </div>
        </div>

        {/* Localized Subtitle Hook */}
        <div 
          className="font-normal tracking-[0.6em] text-[#a8ff00] mt-3 mb-12 uppercase select-none" 
          style={{ 
            fontSize: "clamp(0.7rem, 2vw, 1rem)", 
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            textShadow: "0 2px 8px rgba(0,0,0,0.9)"
          }}
        >
          {t("home_subtitle")}
        </div>

        {/* Interactive Gesture Activation Dock */}
        <div className="flex justify-center mb-8 will-change-transform transform-gpu">
          <button 
            onClick={handleVinylClick}
            className="focus:outline-none transition-transform active:scale-95 cursor-pointer bg-transparent border-0 p-0 block will-change-transform"
            aria-label="Toggle Core Audio Context"
          >
            <VinylPlayer size={playerSize} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {currentTrack?.id && (
            <motion.div
              key={currentTrack.id}
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 select-none transform-gpu"
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Social Matrix Block */}
        <div className="flex flex-wrap gap-7 justify-center items-center mb-10 mt-2 relative z-10 max-w-[460px] mx-auto layout-gpu">
          {socials.map((s, i) => (
            <motion.a 
              key={s.name} 
              href={s.href} 
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                // Bypasses expensive drop-shadow computations frames completely on handheld screens
                filter: !isMobile && isPlaying && currentTrack 
                  ? [
                      `drop-shadow(0 0 2px ${currentTrack.color}44)`,
                      `drop-shadow(0 0 10px ${currentTrack.color}aa)`,
                      `drop-shadow(0 0 2px ${currentTrack.color}44)`
                    ] 
                  : "drop-shadow(0 0 0px transparent)",
                scale: isPlaying ? [1, 1.05, 1] : 1
              }}
              transition={{ 
                opacity: { delay: 0.4 + i * 0.06, duration: 0.4 },
                y: { delay: 0.4 + i * 0.06, duration: 0.4 },
                filter: { 
                  duration: grainDuration, 
                  repeat: isPlaying ? Infinity : 0, 
                  repeatType: "reverse", 
                  ease: "linear" 
                },
                scale: { 
                  duration: pulseDuration, 
                  repeat: isPlaying ? Infinity : 0, 
                  ease: "easeInOut" 
                }
              }}
              className="text-gray-400 no-underline transition-colors duration-200 relative group will-change-transform transform-gpu"
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.9)" }}
              whileHover={isMobile ? {} : { 
                color: currentTrack?.color || '#a8ff00',
                filter: `drop-shadow(0 0 15px ${currentTrack?.color || '#a8ff00'})`,
                scale: 1.2
              }}
              aria-label={s.name}
            >
              <span 
                className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-black/95 border text-[0.55rem] font-black tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-20 rounded-sm translate-y-2 group-hover:translate-y-0"
                style={{ 
                  color: currentTrack?.color || '#a8ff00',
                  borderColor: currentTrack?.color ? `${currentTrack.color}33` : "rgba(255,255,255,0.1)",
                  boxShadow: !isMobile && currentTrack?.color ? `0 0 15px ${currentTrack.color}1A` : "none",
                  textShadow: "0 1px 2px rgba(0,0,0,0.9)"
                }}
              >
                {s.name}
              </span>
              {s.icon}
            </motion.a>
          ))}
        </div>

        {/* Hub Interface Links Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-[460px] w-full mx-auto px-4 relative z-10 mb-6">
          {links.map((l, i) => (
            <Link 
              key={l.href} 
              href={l.href} 
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noopener noreferrer" : undefined}
              className="no-underline block w-full outline-none"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  borderColor: isPlaying && currentTrack ? `${currentTrack.color}33` : "rgba(255,255,255,0.05)",
                  // Flattens infinite box-shadow blending loops down on mobile chips to avoid thermals
                  boxShadow: !isMobile && isPlaying && currentTrack 
                    ? [
                        `0 0 10px ${currentTrack.color}08`,
                        `0 0 25px ${currentTrack.color}1A`,
                        `0 0 10px ${currentTrack.color}08`
                      ]
                    : "0 2px 6px rgba(0,0,0,0.4)",
                  scale: isPlaying ? [1, 1.01, 1] : 1
                }}
                transition={{ 
                  opacity: { delay: 0.3 + i * 0.08, duration: 0.4 },
                  y: { delay: 0.3 + i * 0.08, duration: 0.4 },
                  boxShadow: { 
                    duration: pulseDuration, 
                    repeat: isPlaying ? Infinity : 0, 
                    ease: "easeInOut" 
                  },
                  scale: { 
                    duration: pulseDuration, 
                    repeat: isPlaying ? Infinity : 0, 
                    ease: "easeInOut" 
                  }
                }}
                whileHover={isMobile ? {} : { 
                  scale: 1.04, 
                  borderColor: currentTrack?.color || '#a8ff00', 
                  boxShadow: `0 0 30px ${currentTrack?.color || '#a8ff00'}26`,
                  backgroundColor: currentTrack?.color ? `${currentTrack.color}05` : "rgba(255,255,255,0.02)"
                }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#0b0b0b]/92 border border-white/5 rounded-sm p-5 w-full text-left cursor-pointer group transition-colors duration-300 flex flex-col justify-center h-24 will-change-transform transform-gpu"
                style={{ backdropFilter: "blur(4px)" }}
              >
                <div 
                  className="font-bold text-[1.2rem] tracking-[0.15em] transition-colors duration-300"
                  style={{ 
                    color: isPlaying && currentTrack ? currentTrack.color : "#f0f0f0",
                    fontFamily: "var(--font-barlow-condensed), sans-serif", 
                    margin: 0,
                    textShadow: "0 1px 4px rgba(0,0,0,0.5)"
                  }}
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
      </motion.div>

      {/* ================= 🟢 STICKY CYBERPUNK BRANDING FOOTER DOCK ================= */}
      <footer className="w-full text-center relative z-10 mt-auto pt-8 pb-2 border-t border-white/5 font-mono text-[9px] tracking-[0.3em] text-zinc-600 uppercase select-none">
        <div className="max-w-[460px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            <span>© {new Date().getFullYear()} CARLOS CRUCES</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-500 font-bold">
            <span className="text-[7px] text-zinc-700">// AUDIO_CORE_V1.1_OK</span>
          </div>
        </div>
      </footer>

    </div>
  );
}