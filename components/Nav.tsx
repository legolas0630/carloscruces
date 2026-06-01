"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

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
  ];

  return (
    <motion.nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 sm:px-10 h-16 transition-all duration-300"
      style={{
        background: (scrolled || isOpen) ? "rgba(10,10,10,0.98)" : "transparent",
        borderBottom: (scrolled || isOpen) ? "1px solid #1a1a1a" : "1px solid transparent",
        backdropFilter: (scrolled || isOpen) ? "blur(20px)" : "none",
      }}
    >
      <Link href="/" style={{ textDecoration: "none" }}>
        <motion.div
          onClick={() => setIsOpen(false)}
          whileHover={{ filter: "drop-shadow(0 0 12px #a8ff00)" }}
          style={{ cursor: "pointer", lineHeight: 1.05, userSelect: "none", zIndex: 101 }}
        >
          <div
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 900,
              fontSize: "0.9rem",
              letterSpacing: "0.28em",
              color: "#a8ff00",
            }}
          >
            CARLOS
          </div>
          <div
            style={{
              fontFamily: "var(--font-barlow-condensed), sans-serif",
              fontWeight: 900,
              fontSize: "0.9rem",
              letterSpacing: "0.28em",
              color: "#f0f0f0",
            }}
          >
            CRUCES
          </div>
        </motion.div>
      </Link>

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

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sm:hidden z-[101]"
        style={{ background: "none", border: "none", cursor: "pointer", color: "#f0f0f0", fontSize: "1.5rem" }}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center gap-10 sm:hidden z-[100] overflow-y-auto p-6"
          >
            {/* Subtle background detail to break up flat black */}
            <div className="fixed inset-0 opacity-40 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,#a8ff0022,transparent_70%)]" />
            
            {/* Noise texture overlay to effectively obscure background text */}
            <div className="fixed inset-0 opacity-[0.05] pointer-events-none" 
              style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                backgroundSize: "200px 200px" 
              }} 
            />
            
            {links.map((link, i) => (
              <Link key={link.name} href={link.href} style={{ textDecoration: "none" }}>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    textShadow: pathname === link.href 
                      ? [
                          "0 0 15px rgba(168, 255, 0, 0.4)", 
                          "0 0 35px rgba(168, 255, 0, 0.8)", 
                          "0 0 15px rgba(168, 255, 0, 0.4)"
                        ] 
                      : "0 0 30px rgba(0,0,0,0.8)"
                  }}
                  transition={{ 
                    delay: 0.1 + i * 0.05,
                    textShadow: pathname === link.href 
                      ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      : { duration: 0.3 }
                  }}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontFamily: "var(--font-barlow-condensed), sans-serif", fontWeight: 900,
                    fontSize: "2.4rem", letterSpacing: "0.2em",
                    color: pathname === link.href ? "#a8ff00" : "#f0f0f0",
                    zIndex: 1
                  }}
                >
                  {link.name}
                </motion.button>
              </Link>
            ))}

            {/* Social Media Footer */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-auto pt-8 flex flex-wrap justify-center gap-x-8 gap-y-4 px-10 z-[1]"
            >
              {["BANDCAMP", "SOUNDCLOUD", "RA", "INSTAGRAM"].map((platform) => (
                <a
                  key={platform}
                  href="#"
                  className="text-[0.65rem] font-bold tracking-[0.3em] text-[#444] hover:text-[#a8ff00] transition-colors duration-300 no-underline"
                >
                  {platform}
                </a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
