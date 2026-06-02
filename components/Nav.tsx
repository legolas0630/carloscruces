"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePlayer } from "@/lib/PlayerContext";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { isPlaying, currentTrack } = usePlayer();
  const navRef = useRef<HTMLElement>(null);

  const pulseDuration = React.useMemo(() => {
    const bpm = parseFloat(currentTrack.bpm) || 120;
    return 60 / bpm;
  }, [currentTrack.bpm]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const links = [
    { name: "MUSIC", href: "/music" },
    { name: "VISUALS", href: "/visuals" },
    { name: "EXPEDITIONS", href: "/expeditions" },
    { name: "MERCH", href: "/merch" },
    { name: "ACCOUNT", href: "/login" },
    { name: "CART", href: "/cart" },
  ];

  const socials = [
    {
      name: "Bandcamp",
      href: "#",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M0 21h14.766L24 3H9.234z"/>
        </svg>
      )
    },
    {
      name: "SoundCloud",
      href: "#",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M11.56 8.87c0-.15.03-.3.08-.43.1-.28.34-.49.65-.54.12-.02.24-.01.36.03.1.03.2.09.28.17l.02.02.43.46c.1.1.23.16.38.16.12 0 .23-.04.32-.11l.24-.19c.17-.14.28-.34.32-.56.03-.17.01-.35-.06-.51-.1-.23-.29-.41-.53-.48-.28-.09-.58-.06-.84.07l-.23.12c-.14.07-.3.09-.45.06a.813.813 0 0 1-.5-.39c-.08-.14-.11-.3-.08-.46.04-.24.19-.45.41-.55.15-.07.32-.08.48-.04.14.03.28.11.37.22l.14.16c.07.08.17.13.28.13.08 0 .16-.03.23-.08l.51-.37c.1-.07.17-.18.2-.3.03-.12.01-.24-.05-.35a.81.81 0 0 0-.68-.42c-.22-.01-.44.07-.61.22l-.1.09c-.11.1-.27.14-.42.11a.82.82 0 0 1-.58-.51c-.05-.2-.01-.41.1-.58.12-.18.32-.29.54-.3.14 0 .28.04.4.11l.4.24c.08.05.17.07.26.07.14 0 .26-.06.35-.16l.24-.29c.14-.17.2-.39.18-.61a.822.822 0 0 0-.49-.71c-.26-.11-.56-.1-.8.03l-.4.22c-.11.06-.23.08-.35.06a.541.541 0 0 1-.39-.33c-.05-.12-.06-.24-.02-.36.05-.16.17-.29.33-.35.12-.04.24-.04.36-.01l.4.1c.21.05.43-.01.59-.15.17-.15.25-.37.22-.59a.833.833 0 0 0-.58-.69 2.502 2.502 0 0 0-3.08 1.45l-.04.1c-.05.14-.16.25-.3.3-.14.05-.3.03-.43-.05a2.477 2.477 0 0 0-2.81-.07c-.4.24-.72.58-.93.99l-.05.1c-.06.13-.18.22-.32.25-.14.03-.29-.02-.39-.12a2.483 2.483 0 0 0-3.11-.2c-.44.3-.77.72-.94 1.22l-.02.05c-.06.14-.18.23-.33.25-.14.01-.28-.04-.37-.15a2.52 2.52 0 0 0-1.92-.85c-.69 0-1.35.27-1.84.77-.49.49-.76 1.15-.76 1.84v7.35c0 .69.27 1.35.76 1.84.49.49 1.15.77 1.84.77h13.48c.84 0 1.65-.33 2.25-.93.6-.6.93-1.41.93-2.25v-3.06c0-.84-.33-1.65-.93-2.25a3.153 3.153 0 0 0-2.25-.93z"/>
        </svg>
      )
    },
    {
      name: "Resident Advisor",
      href: "#",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M4 4h4v16H4V4zm6 0h8v4h-8V4zm0 6h8v4h-8v-4zm0 6h8v4h-8v-4z"/>
        </svg>
      )
    },
    {
      name: "Instagram",
      href: "#",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      )
    }
  ];

  return (
    <>
      {/* Main Top Navbar Row */}
      <motion.nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 sm:px-10 h-20 transition-all duration-300"
        style={{
          background: (scrolled || isOpen) ? "rgba(10,10,10,0.85)" : "transparent",
          borderBottom: (scrolled || isOpen) ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
          backdropFilter: (scrolled || isOpen) ? "blur(20px)" : "none",
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <motion.div
            onClick={() => setIsOpen(false)}
            animate={isPlaying ? {
              filter: [
                `drop-shadow(0 0 8px ${currentTrack.color}44)`,
                `drop-shadow(0 0 20px ${currentTrack.color}aa)`,
                `drop-shadow(0 0 8px ${currentTrack.color}44)`
              ],
              scale: [1, 1.03, 1]
            } : {
              filter: "drop-shadow(0 0 0px transparent)",
              scale: 1
            }}
            transition={{ duration: pulseDuration, repeat: isPlaying ? Infinity : 0, ease: "easeInOut" }}
            whileHover={{ filter: `drop-shadow(0 0 15px ${currentTrack.color})`, scale: 1.05 }}
            style={{ cursor: "pointer", lineHeight: 1.05, userSelect: "none", zIndex: 102 }}
          >
            <Image 
              src="/logo.png" 
              alt="Carlos Cruces Logo" 
              width={400} 
              height={115} 
              className="h-12 sm:h-14 w-auto object-contain"
              sizes="(max-width: 640px) 180px, 250px"
              priority
            />
          </motion.div>
        </Link>

        {/* Desktop Menu Links */}
        <div className="hidden sm:flex gap-10">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.name} href={link.href} style={{ textDecoration: "none" }}>
                <motion.button
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "var(--font-barlow-condensed), sans-serif",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    letterSpacing: "0.2em",
                    color: isActive ? "#a8ff00" : "#f0f0f0",
                    padding: "4px 0",
                    borderBottom: isActive ? "1px solid #a8ff00" : "1px solid transparent",
                    transition: "color 0.2s",
                }}
                whileHover={{ color: "#a8ff00", textShadow: "0 0 12px #a8ff00" }}
                >
                  {link.name}
                </motion.button>
              </Link>
            );
          })}
        </div>

        {/* Hamburger Action Trigger */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="sm:hidden z-[110] text-[#f0f0f0] bg-none border-none cursor-pointer focus:outline-none"
            style={{ fontSize: "1.5rem" }}
          >
            ☰
          </button>
        )}
      </motion.nav>

      {/* Full-Screen Mobile Drawer System */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 1. Enhanced Pure Backdrop Blur Layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/65 backdrop-blur-xl z-[101] sm:hidden"
            />

            {/* 2. Transparent Content Overlay Window */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 h-screen w-screen max-w-full bg-transparent flex flex-col justify-between pt-24 pb-24 px-10 sm:hidden z-[105] overflow-y-auto"
            >
              {/* Top Window Dismiss Action */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-6 text-gray-400 hover:text-[#a8ff00] transition-colors duration-200 bg-none border-none cursor-pointer focus:outline-none text-xl z-[115]"
              >
                ✕
              </button>

              {/* Ambient Glowing Background Spot */}
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_80%_20%,#a8ff0015,transparent_50%)]" />
              
              {/* Navigation list */}
              <div className="flex flex-col items-start gap-4 w-full relative z-10">
                {/* Renamed sub-header tracking token to INDEX matching the brand vibe */}
                <div className="text-[0.6rem] tracking-[0.4em] text-[#444] mb-1 font-bold select-none">INDEX</div>
                {links.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link key={link.name} href={link.href} style={{ textDecoration: "none", width: "100%" }}>
                      <motion.button
                        onClick={() => setIsOpen(false)}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ 
                          opacity: 1, 
                          x: 0,
                          textShadow: isActive 
                            ? [
                                "0 0 12px rgba(168, 255, 0, 0.2), 0 0 25px rgba(168, 255, 0, 0.1)", 
                                "0 0 25px rgba(168, 255, 0, 0.8), 0 0 50px rgba(168, 255, 0, 0.4)", 
                                "0 0 12px rgba(168, 255, 0, 0.2), 0 0 25px rgba(168, 255, 0, 0.1)"
                              ] 
                            : "0 0 0px rgba(0,0,0,0)"
                        }}
                        transition={{ 
                          opacity: { delay: 0.05 + i * 0.04 },
                          x: { delay: 0.05 + i * 0.04 },
                          textShadow: isActive 
                            ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                            : { duration: 0.2 }
                        }}
                        style={{
                          background: "none", border: "none", cursor: "pointer",
                          fontFamily: "var(--font-barlow-condensed), sans-serif", 
                          fontWeight: isActive ? 900 : 700,
                          fontSize: "2.5rem", letterSpacing: "0.12em",
                          color: isActive ? "#a8ff00" : "#f0f0f0",
                          textAlign: "left", padding: 0
                        }}
                      >
                        {link.name}
                      </motion.button>
                    </Link>
                  );
                })}
              </div>

              {/* Securely Repositioned Social Vector Icons Row — Lifted completely above the audio player layout */}
              <div className="flex items-center gap-8 border-t border-white/5 pt-6 pb-4 relative z-10 w-full justify-start pl-2 mb-2">
                {socials.map((social, j) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.24 + j * 0.05,
                      duration: 0.35,
                      ease: "easeOut"
                    }}
                    className="text-[#555] hover:text-[#a8ff00] transition-colors duration-200"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}