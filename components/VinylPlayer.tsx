"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { usePlayer } from "@/lib/PlayerContext";

interface VinylPlayerProps {
  size?: number;
}

export default function VinylPlayer({ size = 280 }: VinylPlayerProps) {
  const { currentTrack, isPlaying, progress, toggle } = usePlayer();
  const rotation = useRef(0);
  const animRef = useRef<number | null>(null);
  const vinylRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(true);

  // Detect screen size on mount to completely bypass 3D calculations on mobile
  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth < 768);
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 20 });

  // Dynamic Light/Gloss Logic
  const glossRotate = useSpring(useTransform(x, [-0.5, 0.5], [-45, 45]), { stiffness: 150, damping: 20 });
  const glossOpacity = useSpring(useTransform(y, [-0.5, 0.5], [0.8, 0.4]), { stiffness: 150, damping: 20 });

  // Arm parallax offsets
  const armX = useSpring(useTransform(x, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 20 });
  const armY = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return; // Stop layout calculations on touch screens
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Optimized Loop: Strictly starts and kills itself depending on playback state
  useEffect(() => {
    if (!isPlaying) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    let lastTime = performance.now();
    
    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      // Update rotation angle cleanly
      rotation.current = (rotation.current + delta * 0.04) % 360;

      // Direct DOM manipulation completely cuts out React re-render lags
      if (vinylRef.current) {
        vinylRef.current.style.transform = `rotate(${rotation.current}deg)`;
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying]);

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={toggle}
      style={{
        position: "relative", 
        width: size * 1.2, 
        height: size, 
        cursor: "pointer",
        perspective: 1000, 
        rotateX: isMobile ? 0 : rotateX, // Strip 3D on mobile
        rotateY: isMobile ? 0 : rotateY, 
        transformStyle: "preserve-3d",
        margin: "0 auto"
      }}
      className="flex items-center justify-center"
    >
      {/* Record Sleeve */}
      <motion.div
        animate={{ 
          x: isPlaying ? -size * 0.42 : -size * 0.1,
          rotateY: isPlaying && !isMobile ? -15 : 0,
          opacity: isPlaying ? 0.7 : 1
        }}
        transition={{ type: "spring", stiffness: 50, damping: 18 }}
        style={{
          width: size, height: size, background: "#111", borderRadius: 4,
          overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
          zIndex: 10, position: "absolute",
          transformStyle: "preserve-3d", translateZ: isMobile ? 0 : 40,
          border: "1px solid #222"
        }}
      >
        <img 
          src={currentTrack.sleeveImg || currentTrack.img} 
          alt="Sleeve" 
          style={{ 
            width: "100%", height: "100%", objectFit: "cover", 
            opacity: 0.8, filter: "saturate(0.8) contrast(1.1)" 
          }} 
        />
        <div style={{
          position: "absolute", inset: 0, 
          background: `
            linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(0,0,0,0.3) 100%),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")
          `,
          opacity: 0.15,
          pointerEvents: "none"
        }} />
      </motion.div>

      {/* Disc & Arm Assembly */}
      <motion.div
        initial={{ x: -size * 0.1 }}
        animate={{ x: isPlaying ? size * 0.38 : size * 0.08 }}
        transition={{ type: "spring", stiffness: 40, damping: 16 }}
        style={{ position: "relative", width: size, height: size, zIndex: 5, transformStyle: "preserve-3d" }}
      >
        {/* Background Glow */}
        <motion.div
          animate={{ opacity: isPlaying ? [0.4, 0.8, 0.4] : 0.2 }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", inset: -10, borderRadius: "50%",
            boxShadow: `0 0 40px 10px ${currentTrack.color}33`,
            pointerEvents: "none"
          }}
        />

        {/* Vinyl Disc */}
        <div
          style={{
            width: size, height: size, borderRadius: "50%",
            position: "relative", overflow: "hidden",
            background: "#050505",
            boxShadow: `0 0 0 2px #1a1a1a, inset 0 0 40px rgba(0,0,0,0.9)`,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}
        >
          {/* We style transform directly via ref in loop, leaving standard style clean */}
          <div ref={vinylRef} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src={currentTrack.img} alt={currentTrack.title} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", opacity: 0.85, borderRadius: "50%" }} />
            {/* Grooves */}
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              background: `repeating-radial-gradient(circle, rgba(0,0,0,0) 0px, rgba(0,0,0,0.05) 1px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.05) 3px)`,
              opacity: 0.6, pointerEvents: "none"
            }} />
          </div>

          {/* Dynamic Light/Gloss */}
          <motion.div 
            style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              background: `conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.12) 10%, transparent 25%, transparent 45%, rgba(255,255,255,0.15) 50%, transparent 55%, transparent 80%, rgba(255,255,255,0.12) 90%, transparent 100%)`,
              pointerEvents: "none", zIndex: 1, mixBlendMode: "screen",
              rotate: isMobile ? 0 : glossRotate, opacity: isMobile ? 0.6 : glossOpacity, translateZ: 10
            }} 
          />
          {/* Center Spindle */}
          <div style={{ position: "absolute", width: size * 0.04, height: size * 0.04, borderRadius: "50%", background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "inset 0 0 8px rgba(0,0,0,1)", zIndex: 2 }} />
        </div>

        {/* Tone Arm Assembly */}
        <motion.div 
          style={{ 
            position: "absolute", top: 0, right: 0, width: "100%", height: "100%", 
            pointerEvents: "none", zIndex: 15,
            x: isMobile ? 0 : armX, y: isMobile ? 0 : armY, 
            translateZ: isMobile ? 0 : 80,
            transformStyle: "preserve-3d"
          }}
        >
          <div style={{
            position: "absolute", top: size * 0.02, right: size * 0.02,
            width: size * 0.12, height: size * 0.12, borderRadius: "50%",
            background: "radial-gradient(circle at 30% 30%, #444, #050505)",
            border: "1px solid #222", boxShadow: "0 4px 12px rgba(0,0,0,0.6)"
          }} />
          <motion.div
            animate={{ rotate: isPlaying ? 22 + (progress * 0.08) : -40 }}
            transition={{ type: "spring", stiffness: 45, damping: 15 }}
            style={{
              position: "absolute", top: size * 0.08, right: size * 0.08,
              width: size * 0.018, height: size * 0.75,
              background: "linear-gradient(to right, #555, #222, #555)",
              transformOrigin: "top center", borderRadius: 4,
              boxShadow: "4px 4px 15px rgba(0,0,0,0.5)"
            }}
          >
            <div style={{
              position: "absolute", bottom: -2, left: "-150%",
              width: size * 0.07, height: size * 0.14,
              background: "#111", borderRadius: "2px 2px 6px 6px",
              border: "1px solid #333", transform: "rotate(-12deg)",
              display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 6
            }}>
               <div style={{ width: 2, height: 6, background: currentTrack.color, boxShadow: `0 0 8px ${currentTrack.color}`, opacity: isPlaying ? 0.8 : 0, transition: "opacity 0.5s" }} />
            </div>
          </motion.div>
        </motion.div>

        {/* Play Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={isMobile ? { opacity: 0 } : { opacity: 1 }} // Hover features disabled for mobile screens
          style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20
          }}
        >
          <span style={{ fontSize: size * 0.18, color: "#a8ff00" }}>{isPlaying ? "⏸" : "▶"}</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}