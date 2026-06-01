"use client";

import React from "react";
import { motion } from "framer-motion";
import { EXPEDITIONS } from "@/lib/tracks";
import SectionHeader from "@/components/SectionHeader";

export default function ExpeditionsPage() {
  return (
    <div style={{ minHeight: "100vh", padding: "100px 0 100px", maxWidth: 900, margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div style={{ padding: "0 2.5rem" }}>
          <SectionHeader label="EXPEDITIONS" sub="HIKING · MEDITATION · JOURNAL" />
        </div>
        <div style={{ marginTop: "3.5rem", display: "flex", flexDirection: "column" }}>
          {EXPEDITIONS.map((e, i) => (
            <motion.article key={e.id} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} style={{ borderBottom: "1px solid #1a1a1a" }}>
              <div style={{ position: "relative", overflow: "hidden", height: 320 }}>
                <motion.img src={e.img} alt={e.title} whileHover={{ scale: 1.03 }} transition={{ duration: 0.8 }} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.6)" }} />
                <div style={{ position: "absolute", inset: 0, padding: "2rem 2.5rem", display: "flex", flexDirection: "column", justifyContent: "flex-end", background: "linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 60%)" }}>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "baseline", marginBottom: "0.4rem" }}>
                    <span style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontWeight: 300, fontSize: "0.7rem", letterSpacing: "0.3em", color: "#a8ff00" }}>{e.date}</span>
                    <span style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 300, fontSize: "0.7rem", color: "#555" }}>{e.location}</span>
                  </div>
                  <h2 style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontWeight: 900, fontSize: "clamp(1.5rem,4vw,2.2rem)", letterSpacing: "0.1em", color: "#f0f0f0" }}>{e.title}</h2>
                </div>
              </div>
              <div style={{ padding: "2rem 2.5rem 3rem" }}>
                <p style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 300, fontSize: "1.05rem", lineHeight: 1.75, color: "#888", maxWidth: 620 }}>{e.body}</p>
                <motion.button whileHover={{ color: "#a8ff00", x: 4 }} style={{ marginTop: "1.5rem", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-barlow-condensed), sans-serif", fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.2em", color: "#444" }}>
                  READ ENTRY →
                </motion.button>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
