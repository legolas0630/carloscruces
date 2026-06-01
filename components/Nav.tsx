"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { name: "MUSIC", href: "/music" },
    { name: "VISUALS", href: "/visuals" },
    { name: "EXPEDITIONS", href: "/expeditions" },
    { name: "MERCH", href: "/merch" },
  ];

  return (
    <motion.nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2.5rem",
        height: "64px",
        background: scrolled ? "rgba(10,10,10,0.95)" : "transparent",
        borderBottom: scrolled ? "1px solid #1a1a1a" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <Link href="/" style={{ textDecoration: "none" }}>
        <motion.div
          whileHover={{ filter: "drop-shadow(0 0 12px #a8ff00)" }}
          style={{ cursor: "pointer", lineHeight: 1.05, userSelect: "none" }}
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

      <div style={{ display: "flex", gap: "2.5rem" }}>
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
    </motion.nav>
  );
}
