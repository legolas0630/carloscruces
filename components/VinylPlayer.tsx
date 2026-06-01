"use client";

import React, { useRef, useEffect } from "react";
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

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 20 });

  // Dynamic Light/Gloss Logic
  const glossRotate = useSpring(useTransform(x, [-0.5, 0.5], [-45, 45]), { stiffness: 150, damping: 20 });
  const glossOpacity = useSpring(useTransform(y, [-0.5, 0.5], [0.8, 0.4]), { stiffness: 150, damping: 20 });

  // Arm parallax offsets: exaggerated movement to simulate height
  const armX = useSpring(useTransform(x, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 20 });
  const armY = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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

  useEffect(() => {
    let lastTime: number | null = null;
    const animate = (time: number) => {
      if (isPlaying) {
        if (lastTime) rotation.current += (time - lastTime) * 0.04;
        lastTime = time;
        if (vinylRef.current) vinylRef.current.style.transform = `rotate(${rotation.current}deg)`;
      } else {
        lastTime = null;
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
        position: "relative", width: size * 1.2, height: size, cursor: "pointer",
        perspective: 1000, rotateX, rotateY, transformStyle: "preserve-3d",
        margin: "0 auto"
      }}
      className="flex items-center justify-center"
    >
      {/* Record Sleeve */}
      <motion.div
        animate={{ 
          x: isPlaying ? -size * 0.45 : -size * 0.15,
          rotateY: isPlaying ? -15 : 0,
          opacity: isPlaying ? 0.6 : 1
        }}
        transition={{ type: "spring", stiffness: 40, damping: 15 }}
        style={{
          width: size, height: size, background: "#111", borderRadius: 4,
          overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
          zIndex: 10, position: "absolute",
          transformStyle: "preserve-3d", translateZ: 40,
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
        {/* Sleeve Matte/Paper Texture Overlay */}
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

      {/* Disc & Arm Assembly - Slides out on load */}
      <motion.div
        initial={{ x: -size * 0.2 }}
        animate={{ x: isPlaying ? size * 0.35 : size * 0.1 }}
        transition={{ delay: 0.5, duration: 1.2, ease: "circOut" }}
        style={{ position: "relative", width: size, height: size, zIndex: 5, transformStyle: "preserve-3d" }}
      >
        {/* Background Glow */}
        <motion.div
          animate={{ opacity: isPlaying ? [0.4, 1, 0.4] : 0.2, scale: isPlaying ? [1, 1.04, 1] : 1 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", inset: -20, borderRadius: "50%",
            boxShadow: `0 0 40px 20px ${currentTrack.color}44, 0 0 80px 40px ${currentTrack.color}22`,
            pointerEvents: "none"
          }}
        />

        {/* Vinyl Disc */}
        <div
          ref={vinylRef}
          style={{
            width: size, height: size, borderRadius: "50%",
            position: "relative", overflow: "hidden",
            background: "#050505",
            boxShadow: `0 0 0 2px #1a1a1a, inset 0 0 40px rgba(0,0,0,0.9)`,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}
        >
          <img src={currentTrack.img} alt={currentTrack.title} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} />
          {/* Grooves */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: `repeating-radial-gradient(circle, rgba(0,0,0,0) 0px, rgba(0,0,0,0.05) 1px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.05) 3px)`,
            opacity: 0.6, pointerEvents: "none"
          }} />
          {/* Dynamic Light/Gloss */}
          <motion.div 
            style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              background: `conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.15) 10%, transparent 25%, transparent 45%, rgba(255,255,255,0.2) 50%, transparent 55%, transparent 80%, rgba(255,255,255,0.15) 90%, transparent 100%)`,
              pointerEvents: "none", zIndex: 1, mixBlendMode: "screen",
              rotate: glossRotate, opacity: glossOpacity, translateZ: 10
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
            x: armX, y: armY, 
            translateZ: 80, // Lifted high
            transformStyle: "preserve-3d"
          }}
        >
          <div style={{
            position: "absolute", top: size * 0.02, right: size * 0.02,
            width: size * 0.15, height: size * 0.15, borderRadius: "50%",
            background: "radial-gradient(circle at 30% 30%, #444, #050505)",
            border: "1px solid #222", boxShadow: "0 4px 12px rgba(0,0,0,0.6)"
          }} />
          <motion.div
            animate={{ rotate: isPlaying ? 20 + (progress * 0.12) : -45 }}
            transition={{ type: "spring", stiffness: 35, damping: 12 }}
            style={{
              position: "absolute", top: size * 0.095, right: size * 0.095,
              width: size * 0.02, height: size * 0.8,
              background: "linear-gradient(to right, #555, #222, #555)",
              transformOrigin: "top center", borderRadius: 4,
              boxShadow: "4px 4px 15px rgba(0,0,0,0.5)"
            }}
          >
            <div style={{
              position: "absolute", bottom: -2, left: "-150%",
              width: size * 0.08, height: size * 0.16,
              background: "#111", borderRadius: "2px 2px 8px 8px",
              border: "1px solid #333", transform: "rotate(-15deg)",
              display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 6
            }}>
               <div style={{ width: 2, height: 6, background: currentTrack.color, boxShadow: `0 0 8px ${currentTrack.color}`, opacity: isPlaying ? 0.8 : 0, transition: "opacity 0.5s" }} />
            </div>
          </motion.div>
        </motion.div>

        {/* Play Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
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
