"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { usePlayer } from "@/lib/PlayerContext";

interface VinylPlayerProps {
  size?: number;
}

export default function VinylPlayer({ size = 280 }: VinylPlayerProps) {
  const { currentTrack, isPlaying, toggle } = usePlayer();
  const rotation = useRef(0);
  const animRef = useRef<number | null>(null);
  const vinylRef = useRef<HTMLDivElement>(null);

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
    <div style={{ position: "relative", width: size, height: size, cursor: "pointer" }} onClick={toggle}>
      <motion.div
        animate={{ opacity: isPlaying ? [0.4, 1, 0.4] : 0.2, scale: isPlaying ? [1, 1.04, 1] : 1 }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", inset: -20, borderRadius: "50%",
          boxShadow: `0 0 40px 20px ${currentTrack.color}44, 0 0 80px 40px ${currentTrack.color}22`,
          pointerEvents: "none"
        }}
      />
      <div
        ref={vinylRef}
        style={{
          width: size, height: size, borderRadius: "50%",
          background: `
            radial-gradient(circle at 50% 50%, transparent 28%, #0a0a0a 28.5%, #0a0a0a 29%, #111 29.5%, #0d0d0d 32%, #111 34.5%, #0a0a0a 35%, #111 37%, #0d0d0d 39%, #111 41%, #0a0a0a 43%, #111 45%, #0d0d0d 47%, #111 49%),
            conic-gradient(from 0deg, #111, #0a0a0a, #1a1a1a, #0a0a0a, #111)
          `,
          boxShadow: `0 0 0 2px #1a1a1a, inset 0 0 30px rgba(0,0,0,0.8)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden"
        }}
      >
        <div style={{
          width: size * 0.38, height: size * 0.38, borderRadius: "50%",
          overflow: "hidden", border: `2px solid ${currentTrack.color}55`,
          boxShadow: `0 0 15px ${currentTrack.color}44`
        }}>
          <img src={currentTrack.img} alt={currentTrack.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{
          position: "absolute", width: 10, height: 10, borderRadius: "50%",
          background: "#a8ff00", boxShadow: "0 0 8px #a8ff00"
        }} />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}
      >
        <span style={{ fontSize: size * 0.18, color: "#a8ff00" }}>{isPlaying ? "⏸" : "▶"}</span>
      </motion.div>
    </div>
  );
}
