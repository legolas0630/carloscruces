"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VISUALS } from "@/lib/tracks";
import SectionHeader from "@/components/SectionHeader";

export default function VisualsPage() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div style={{ minHeight: "100vh", padding: "100px 2.5rem 100px", maxWidth: 1100, margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <SectionHeader label="VISUALS" sub="GRAPHIC DESIGN · ART DIRECTION" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginTop: "3rem" }}>
          {VISUALS.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              onHoverStart={() => setHovered(v.id)}
              onHoverEnd={() => setHovered(null)}
              style={{ position: "relative", overflow: "hidden", cursor: "pointer", gridRow: v.h === "tall" ? "span 2" : "span 1", borderRadius: 2, background: "#111" }}
            >
              <motion.img
                src={v.img} alt={v.title}
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.5 }}
                style={{ width: "100%", objectFit: "cover", display: "block", minHeight: v.h === "wide" ? 160 : 220, height: v.h === "tall" ? "100%" : "auto" }}
              />
              <AnimatePresence>
                {hovered === v.id && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "flex-end", padding: "1.5rem" }}>
                    <div>
                      <div style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "0.15em", color: "#a8ff00" }}>{v.title}</div>
                      <div style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 300, fontSize: "0.7rem", color: "#888", marginTop: 2 }}>VIEW FULL SIZE →</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
