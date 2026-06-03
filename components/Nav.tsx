"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayer } from "@/context/PlayerContext";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import { supabase } from "@/lib/supabase/client"; // Native client connection

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null); // Track authentication state locally
  const pathname = usePathname();
  const { isPlaying, currentTrack } = usePlayer();
  const { t, locale } = useLanguage();
  const navRef = useRef<HTMLElement>(null);

  // Deep, steady sound system pulse rate (equivalent to a grounded 120 BPM cadence)
  const pulseDuration = 0.5;

  // Real-time Supabase Auth Session Sync Lifecycle Loop
  useEffect(() => {
    // 1. Instantly parse current session token on mount
    supabase.auth.getUser().then(({ data: { user: activeUser } }) => {
      setUser(activeUser);
    });

    // 2. Open active websocket channel to intercept any login/logout events dynamically
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Scroll Tracking Lifecycle Boundary
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Dismiss Drawer on Outside Click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Dynamic Navigation Engine Schema — Recalculates securely on user variations
  const links = useMemo(() => [
    { name: t("nav_music"), href: "/music" },
    { name: t("nav_visuals"), href: "https://xiwame.space", external: true }, 
    { name: t("nav_expeditions"), href: "/expeditions" },
    { name: t("nav_merch"), href: "/merch" },
    { name: t("nav_account"), href: user ? "/dashboard" : "/login" }, // Uses native user instance
    { name: t("nav_cart"), href: "/cart" },
  ], [user, locale, t]);

  // Social Matrix Schema optimized to prevent redundant re-renders
  const socials = useMemo(() => [
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
          <path d="M0 21h14.766L24 3H9.234z" />
        </svg>
      ),
    },
    {
      name: "SoundCloud",
      href: "https://soundcloud.com/carlos-cruces-1",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M11.56 8.87c0-.15.03-.3.08-.43.1-.28.34-.49.65-.54.12-.02.24-.01.36.03.1.03.2.09.28.17l.02.02.43.46c.1.1.23.16.38.16.12 0 .23-.04.32-.11l.24-.19c.17-.14.28-.34.32-.56.03-.17.01-.35-.06-.51-.1-.23-.29-.41-.53-.48-.28-.09-.58-.06-.84.07l-.23.12c-.14.07-.3.09-.45.06a.813.813 0 0 1-.5-.39c-.08-.14-.11-.3-.08-.46.04-.24.19-.45.41-.55.15-.07.32-.08.48-.04.14.03.28.11.37.22l.14.16c.07.08.17.13.28.13.08 0 .16-.03.23-.08l.51-.37c.1-.07.17-.18.2-.3.03-.12.01-.24-.05-.35a.81.81 0 0 0-.68-.42c-.22-.01-.44.07-.61.22l-.1.09c-.11.1-.27.14-.42.11a.82.82 0 0 1-.58-.51c-.05-.2-.01-.41.1-.58.12-.18.32-.29.54-.3.14 0 .28.04.4.11l.4.24c.08.05.17.07.26.07.14 0 .26-.06.35-.16l.24-.29c.14-.17.2-.39.18-.61a.822.822 0 0 0-.49-.71c-.26-.11-.56-.1-.8.03l-.4.22c-.11.06-.23.08-.35.06a.541.541 0 0 1-.39-.33c-.05-.12-.06-.24-.02-.36.05-.16.17-.29.33-.35.12-.04.24-.04.36-.01l.4.1c.21.05.43-.01.59-.15.17-.15.25-.37.22-.59a.833.833 0 0 0-.58-.69 2.502 2.502 0 0 0-3.08 1.45l-.04.1c-.05.14-.16.25-.3.3-.14.05-.3.03-.43-.05a2.477 2.477 0 0 0-2.81-.07c-.4.24-.72.58-.93.99l-.05.1c-.06.13-.18.22-.32.25-.14.03-.29-.02-.39-.12a2.483 2.483 0 0 0-3.11-.2c-.44.3-.77.72-.94 1.22l-.02.05c-.06.14-.18.23-.33.25-.14.01-.28-.04-.37-.15a2.52 2.52 0 0 0-1.92-.85c-.69 0-1.35.27-1.84.77-.49.49-.76 1.15-.76 1.84v7.35c0 .69.27 1.35.76 1.84.49.49 1.15.77 1.84.77h13.48c.84 0 1.65-.33 2.25-.93.6-.6.93-1.41.93-2.25v-3.06c0-.84-.33-1.65-.93-2.25a3.153 3.153 0 0 0-2.25-.93z" />
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
  ], [user]);

  return (
    <>
      <motion.nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 sm:px-10 h-20 transition-all duration-300 ${
          scrolled || isOpen 
            ? "bg-[#0a0a0a]/85 border-b border-white/5 backdrop-blur-[20px]" 
            : "bg-transparent border-b border-transparent backdrop-blur-none"
        }`}
      >
        <Link href="/" className="no-underline">
          <motion.div
            onClick={() => setIsOpen(false)}
            animate={isPlaying ? {
              filter: [
                `drop-shadow(0 0 8px ${currentTrack?.color || '#a8ff00'}44)`,
                `drop-shadow(0 0 20px ${currentTrack?.color || '#a8ff00'}aa)`,
                `drop-shadow(0 0 8px ${currentTrack?.color || '#a8ff00'}44)`
              ],
              scale: [1, 1.03, 1]
            } : {
              filter: "drop-shadow(0 0 0px transparent)",
              scale: 1
            }}
            transition={{ duration: pulseDuration, repeat: isPlaying ? Infinity : 0, ease: "easeInOut" }}
            whileHover={{ filter: `drop-shadow(0 0 15px ${currentTrack?.color || '#a8ff00'})`, scale: 1.05 }}
            className="cursor-pointer select-none z-[102] leading-[1.05]"
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

        {/* Desktop Navigation Links Row */}
        <div className="hidden sm:flex items-center gap-10">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.name === t("nav_account") && pathname === "/dashboard");
            const buttonContent = (
              <motion.button
                className={`bg-transparent border-none cursor-pointer text-sm font-bold tracking-[0.2em] font-barlow-condensed py-1 border-b transition-colors duration-200 ${
                  isActive ? "text-[#a8ff00] border-[#a8ff00]" : "text-[#f0f0f0] border-transparent"
                }`}
                whileHover={{ color: "#a8ff00", textShadow: "0 0 12px #a8ff00" }}
              >
                {link.name}
              </motion.button>
            );

            return link.external ? (
              <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className="no-underline">
                {buttonContent}
              </a>
            ) : (
              <Link key={link.name} href={link.href} className="no-underline">
                {buttonContent}
              </Link>
            );
          })}

          {/* Integrated Desktop Language Selector */}
          <div className="ml-2 border-l border-white/10 pl-4 flex items-center h-5">
            <LanguageSelector />
          </div>
        </div>

        {/* Mobile Hamburger Drawer Trigger */}
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="sm:hidden z-[110] text-[#f0f0f0] bg-transparent border-none cursor-pointer focus:outline-none text-2xl flex items-center justify-center p-1"
          >
            <div className="flex flex-col gap-1.5 w-6">
              <span className="w-full h-0.5 bg-[#f0f0f0]"></span>
              <span className="w-full h-0.5 bg-[#f0f0f0]"></span>
            </div>
          </button>
        )}
      </motion.nav>

      {/* Full-Screen Mobile Panel Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/65 backdrop-blur-xl z-[101] sm:hidden"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 h-screen w-screen max-w-full bg-transparent flex flex-col justify-between pt-28 pb-24 px-10 sm:hidden z-[105] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 text-zinc-500 hover:text-[#a8ff00] transition-colors duration-200 bg-transparent border-none cursor-pointer focus:outline-none text-2xl z-[115]"
              >
                ✕
              </button>

              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_80%_20%,#a8ff0015,transparent_50%)]" />
              
              {/* Vertical Navigation System */}
              <div className="flex flex-col items-start gap-4 w-full relative z-10">
                <div className="flex items-center justify-between w-full border-b border-white/5 pb-2 mb-2 select-none">
                  <div className="text-[0.6rem] tracking-[0.4em] text-zinc-700 font-bold">INDEX</div>
                  <div className="scale-90 origin-right">
                    <LanguageSelector />
                  </div>
                </div>

                {links.map((link, i) => {
                  const isActive = pathname === link.href || (link.name === t("nav_account") && pathname === "/dashboard");
                  const mobileButton = (
                    <motion.button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        textShadow: isActive 
                          ? [`0 0 12px ${(currentTrack?.color || '#a8ff00')}33`, `0 0 25px ${(currentTrack?.color || '#a8ff00')}`, `0 0 12px ${(currentTrack?.color || '#a8ff00')}33`] 
                          : "0 0 0px rgba(0,0,0,0)"
                      }}
                      transition={{ 
                        opacity: { delay: 0.05 + i * 0.04 },
                        x: { delay: 0.05 + i * 0.04 },
                        textShadow: isActive ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }
                      }}
                      className={`bg-transparent border-none cursor-pointer font-barlow-condensed tracking-[0.12em] text-left p-0 text-4xl uppercase ${
                        isActive ? "text-[#a8ff00] font-black" : "text-[#f0f0f0] font-bold"
                      }`}
                    >
                      {link.name}
                    </motion.button>
                  );

                  return link.external ? (
                    <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className="no-underline w-full">
                      {mobileButton}
                    </a>
                  ) : (
                    <Link key={link.name} href={link.href} className="no-underline w-full">
                      {mobileButton}
                    </Link>
                  );
                })}
              </div>

              {/* Synchronized Mobile Social Matrix */}
              <div className="flex flex-wrap items-center gap-6 border-t border-white/5 pt-6 pb-4 relative z-10 w-full justify-start pl-1 mb-2">
                {socials.map((social, j) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label={social.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      filter: isPlaying && currentTrack 
                        ? [
                            `drop-shadow(0 0 2px ${currentTrack.color}22)`,
                            `drop-shadow(0 0 8px ${currentTrack.color}aa)`,
                            `drop-shadow(0 0 2px ${currentTrack.color}22)`
                          ]
                        : "drop-shadow(0 0 0px transparent)",
                      scale: isPlaying ? [1, 1.1, 1] : 1
                    }}
                    transition={{
                      opacity: { delay: 0.2 + j * 0.04, duration: 0.3 },
                      y: { delay: 0.2 + j * 0.04, duration: 0.3 },
                      filter: { duration: pulseDuration * 2, repeat: isPlaying ? Infinity : 0, ease: "linear" },
                      scale: { duration: pulseDuration, repeat: isPlaying ? Infinity : 0, ease: "easeInOut" }
                    }}
                    whileHover={{ color: currentTrack?.color || '#a8ff00', scale: 1.2 }}
                    className="text-gray-400 hover:text-[#a8ff00] transition-colors duration-200"
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