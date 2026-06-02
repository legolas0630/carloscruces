"use client";

import React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ParallaxBackground() {
  const { scrollYProgress } = useScroll();
  
  // Transform scroll progress (0 to 1) into a subtle Y translation (0% to -10%)
  // Using percentages ensures the effect feels consistent across all device heights.
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
      <motion.div 
        style={{ y }} 
        className="absolute top-0 left-0 w-full h-[110%]"
      >
        <Image
          src="/background.jpg"
          alt="Site Background"
          fill
          priority
          quality={85}
          className="object-cover opacity-40"
          sizes="100vw"
        />
      </motion.div>
    </div>
  );
}