"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MERCH } from "@/lib/tracks";
import SectionHeader from "@/components/SectionHeader";

export default function MerchPage() {
  const [added, setAdded] = useState<{ [key: number]: boolean }>({});
  
  const handleAdd = (id: number) => {
    setAdded(a => ({ ...a, [id]: true }));
    setTimeout(() => setAdded(a => ({ ...a, [id]: false })), 1500);
  };

  return (
    <div style={{ minHeight: "100vh", padding: "100px 2.5rem 100px", maxWidth: 1100, margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <SectionHeader label="MERCH" sub="GEAR · APPAREL · LIMITED DROPS" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginTop: "3rem" }}>
          {MERCH.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} whileHover={{ y: -4 }}
              style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 2, overflow: "hidden", cursor: "pointer" }}>
              <div style={{ position: "relative", overflow: "hidden" }}>
                <motion.img src={item.img} alt={item.name} whileHover={{ scale: 1.05 }} transition={{ duration: 0.5 }} style={{ width: "100%", display: "block", aspectRatio: "1/1", objectFit: "cover" }} />
                {item.tag && (
                  <div style={{ position: "absolute", top: 10, left: 10, background: "#a8ff00", color: "#0a0a0a", fontFamily: "var(--font-barlow-condensed), sans-serif", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.15em", padding: "2px 8px", borderRadius: 1 }}>
                    {item.tag}
                  </div>
                )}
              </div>
              <div style={{ padding: "1rem 1.2rem 1.2rem" }}>
                <div style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.1em", color: "#f0f0f0" }}>{item.name}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.75rem" }}>
                  <span style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontWeight: 600, fontSize: "1.1rem", color: "#a8ff00" }}>{item.price}</span>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleAdd(item.id)} style={{
                    background: added[item.id] ? "#a8ff00" : "transparent",
                    border: `1px solid ${added[item.id] ? "#a8ff00" : "#2a2a2a"}`, borderRadius: 1,
                    fontFamily: "var(--font-barlow-condensed), sans-serif", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.15em",
                    color: added[item.id] ? "#0a0a0a" : "#888", padding: "6px 12px", cursor: "pointer", transition: "all 0.2s"
                  }}>
                    {added[item.id] ? "ADDED ✓" : "ADD TO CART"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "3rem", fontFamily: "var(--font-barlow), sans-serif", fontWeight: 300, fontSize: "0.8rem", color: "#333", letterSpacing: "0.1em" }}>
          FREE SHIPPING ON ORDERS OVER €75 · LIMITED RUNS · NO RESTOCKS
        </div>
      </motion.div>
    </div>
  );
}
