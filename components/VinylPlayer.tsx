"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
import { usePlayer } from "@/context/PlayerContext";

interface VinylPlayerProps {
  size?: number;
}

export default function VinylPlayer({ size = 280 }: VinylPlayerProps) {
  const { currentTrack, isPlaying, progress, toggle, setRate, setHighPass, setDistortion, setCrackle } = usePlayer();
  const rotation = useRef(0);
  const animRef = useRef<number | null>(null);
  const vinylRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(true);
  const [isScratching, setIsScratching] = useState(false);
  
  // Positional and Vector references for accurate scratching mechanics
  const centerCoords = useRef({ x: 0, y: 0 });
  const lastAngle = useRef(0);
  const lastMoveTime = useRef(0);
  const dragDistance = useRef(0);
  const armWobble = useMotionValue(0);

  // Monitor device profile breakpoints safely
  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth < 768);
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // 3D Perspective Tilt Mechanics
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 20 });

  // Light flare dynamic reflection parameters
  const glossRotate = useSpring(useTransform(x, [-0.5, 0.5], [-45, 45]), { stiffness: 150, damping: 20 });
  const glossOpacity = useSpring(useTransform(y, [-0.5, 0.5], [0.8, 0.4]), { stiffness: 150, damping: 20 });

  // Tone arm dynamic parallax depth offsets
  const armX = useSpring(useTransform(x, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 20 });
  const armY = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
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

  // Helper calculation to determine touch vector angle relative to disc core center
  const getAngle = (clientX: number, clientY: number) => {
    const dx = clientX - centerCoords.current.x;
    const dy = clientY - centerCoords.current.y;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsScratching(true);
    dragDistance.current = 0;
    lastMoveTime.current = performance.now();

    if (vinylRef.current) {
      const rect = vinylRef.current.getBoundingClientRect();
      centerCoords.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      lastAngle.current = getAngle(e.clientX, e.clientY);
    }
    
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isScratching) {
      handleMouseMove(e);
      return;
    }

    e.preventDefault();
    const now = performance.now();
    const deltaTime = now - lastMoveTime.current;

    // Standardize polar trajectory calculation across desktop, tablet, and mobile axes
    const currentAngle = getAngle(e.clientX, e.clientY);
    let deltaAngle = currentAngle - lastAngle.current;

    // Handle rotational boundary constraints at the 180/-180 break threshold
    if (deltaAngle > 180) deltaAngle -= 360;
    if (deltaAngle < -180) deltaAngle += 360;

    // Map gesture angular velocity parameters straight to the audio matrix pipeline
    const velocity = Math.abs(deltaAngle) / (deltaTime || 1);
    
    // Scale rate manipulation curves based on scratch direction
    const rateDirection = deltaAngle >= 0 ? 1 : -1;
    const targetRate = Math.min(Math.max(-3.0, (velocity * 1.8) * rateDirection), 3.0);
    
    // Smooth out jitter configurations if pointer is moving slowly
    if (Math.abs(deltaAngle) > 0.1) {
      setRate(targetRate);
      
      const targetFreq = Math.min(20 + velocity * 1200, 3500);
      const distortionAmount = Math.min(velocity * 0.3, 0.8);
      const crackleIntensity = Math.min(0.2 + velocity * 0.4, 0.7);

      setHighPass(targetFreq);
      setDistortion(distortionAmount);
      setCrackle(crackleIntensity);
    }

    dragDistance.current += Math.abs(deltaAngle);
    rotation.current = (rotation.current + deltaAngle) % 360;

    lastAngle.current = currentAngle;
    lastMoveTime.current = now;

    // Render directly to DOM to bypass latency bottlenecks
    if (vinylRef.current) {
      vinylRef.current.style.transform = `rotate(${rotation.current}deg)`;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsScratching(false);
    e.currentTarget.releasePointerCapture(e.pointerId);

    // Smoothly restore defaults
    setRate(1.0);
    setHighPass(20);
    setDistortion(0);
    setCrackle(isPlaying ? 0.2 : 0);

    animate(armWobble, [0, 6, -3, 1, 0], {
      type: "spring",
      stiffness: 350,
      damping: 10,
    });
  };

  // Continuous background canvas rendering loop
  useEffect(() => {
    if (!isPlaying || isScratching) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    let lastTime = performance.now();
    
    const animateLoop = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      const bpm = parseFloat(currentTrack.bpm) || 128;
      const speedFactor = bpm / 128;
      rotation.current = (rotation.current + delta * 0.04 * speedFactor) % 360;

      if (vinylRef.current) {
        vinylRef.current.style.transform = `rotate(${rotation.current}deg)`;
      }

      animRef.current = requestAnimationFrame(animateLoop);
    };

    animRef.current = requestAnimationFrame(animateLoop);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, currentTrack, isScratching]);

  return (
    <motion.div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onMouseLeave={handleMouseLeave}
      onClick={() => dragDistance.current < 8 && toggle()}
      style={{
        position: "relative", 
        width: isMobile ? size : size * 1.2, 
        height: size, 
        cursor: "grab",
        perspective: 1000, 
        rotateX: isMobile ? 0 : rotateX,
        rotateY: isMobile ? 0 : rotateY,
        rotate: armWobble, 
        transformStyle: "preserve-3d",
        margin: "0 auto",
        touchAction: "none", // Prevent native browser intercepts and layout page scrolls
        userSelect: "none"
      }}
      className="flex items-center justify-center select-none"
    >
      {/* Record Sleeve */}
      <motion.div
        animate={{ 
          x: isPlaying ? -size * 0.35 : 0,
          rotateY: isPlaying && !isMobile ? -12 : 0,
          opacity: isPlaying && isMobile ? 0.4 : 1
        }}
        transition={{ type: "spring", stiffness: 60, damping: 20 }}
        style={{
          width: size, height: size, background: "#111", borderRadius: 4,
          overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
          zIndex: 10, position: "absolute",
          transformStyle: "preserve-3d", translateZ: isMobile ? 0 : 40,
          border: "1px solid #222"
        }}
      >
        <Image 
          src={currentTrack.sleeveImg || currentTrack.img} 
          alt="Sleeve" 
          fill
          priority
          className="object-cover opacity-80 saturate-[0.8] contrast-[1.1] pointer-events-none"
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
        initial={{ x: 0 }}
        animate={{ x: isPlaying ? size * 0.32 : size * 0.05 }}
        transition={{ type: "spring", stiffness: 50, damping: 18 }}
        style={{ position: "relative", width: size, height: size, zIndex: 5, transformStyle: "preserve-3d" }}
      >
        {/* Ambient Pulse Glow */}
        <motion.div
          animate={{ opacity: isPlaying ? [0.3, 0.6, 0.3] : 0.1 }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", inset: -10, borderRadius: "50%",
            boxShadow: `0 0 40px 10px ${currentTrack.color}22`,
            pointerEvents: "none"
          }}
        />

        {/* Vinyl Disc Body */}
        <div
          style={{
            width: size, height: size, borderRadius: "50%",
            position: "relative", overflow: "hidden",
            background: "#050505",
            boxShadow: `0 0 0 2px #1a1a1a, inset 0 0 40px rgba(0,0,0,0.9)`,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}
        >
          <div ref={vinylRef} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", willChange: "transform" }}>
            <Image src={currentTrack.img} alt={currentTrack.title} fill className="object-cover opacity-[0.85] rounded-full pointer-events-none" />
            
            {/* Grooves */}
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              background: `repeating-radial-gradient(circle, rgba(0,0,0,0) 0px, rgba(0,0,0,0.05) 1px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.05) 3px)`,
              opacity: 0.6, pointerEvents: "none"
            }} />
          </div>

          {/* Dynamic Light/Gloss Overlay */}
          <motion.div 
            style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              background: `conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.12) 10%, transparent 25%, transparent 45%, rgba(255,255,255,0.15) 50%, transparent 55%, transparent 80%, rgba(255,255,255,0.12) 90%, transparent 100%)`,
              pointerEvents: "none", zIndex: 1, mixBlendMode: "screen",
              rotate: isMobile ? 0 : glossRotate, opacity: isMobile ? 0.5 : glossOpacity, translateZ: 10
            }} 
          />
          {/* Spindle Core */}
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: size * 0.04, height: size * 0.04, borderRadius: "50%", background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "inset 0 0 8px rgba(0,0,0,1)", zIndex: 2 }} />
        </div>

        {/* Mechanical Tone Arm */}
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

        {/* Play State Overlay (Only shown on Desktop Hover) */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              background: "rgba(0,0,0,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20
            }}
          >
            <span style={{ fontSize: size * 0.15, color: "#a8ff00" }}>{isPlaying ? "⏸" : "▶"}</span>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}