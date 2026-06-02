"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import SectionHeader from "@/components/SectionHeader";
import { useCart } from "@/context/CartContext";

// PRODUCTION TOGGLE: Set to false when your shop is ready to accept orders
const COMING_SOON = true;

export default function MerchPage() {
  const { addToCart } = useCart();
  const [added, setAdded] = useState<{ [key: number]: boolean }>({});

  const handleAdd = (id: number, name: string, price: number) => {
    addToCart({ id, name, price });
    setAdded((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAdded((prev) => ({ ...prev, [id]: false }));
    }, 1500);
  };

  // Scalable structural array ready for your real store items
  const merchItems = [
    { id: 1, name: "CRUCES ACID TEE", price: 35, img: "/merch/acid-tee.jpg", tag: "LIMITED", color: "#a8ff00" },
    { id: 2, name: "RITUAL HOODIE", price: 75, img: "/merch/hoodie.jpg", tag: "NEW", color: "#00E5FF" },
    { id: 3, name: "VOID SIGNAL CAP", price: 28, img: "/merch/cap.jpg", tag: "PRE-ORDER", color: "#9D00FF" },
    { id: 4, name: "CYBERO PATCH SET", price: 15, img: "/merch/patches.jpg", tag: "BUNDLE", color: "#FF3D00" },
    { id: 5, name: "LOGO LONG SLEEVE", price: 45, img: "/merch/longsleeve.jpg", tag: "", color: "#f0f0f0" },
    { id: 6, name: "AMUNITION JACKET", price: 120, img: "/merch/jacket.jpg", tag: "COLLAB", color: "#FFC107" },
  ];

  return (
    <div className="min-h-screen py-32 px-6 sm:px-10 max-w-[1100px] mx-auto select-none">
      <SectionHeader label="MERCH" sub="GEAR · APPAREL · LIMITED DROPS" />

      {COMING_SOON ? (
        /* --- BAD ASS COMING SOON LAYOUT --- */
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-16 relative overflow-hidden border border-zinc-900 bg-black/40 backdrop-blur-md rounded-sm p-12 sm:p-20 flex flex-col items-center justify-center text-center min-h-[450px]"
        >
          {/* Audio Grid Scanline Decorative Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_95%,rgba(168,255,0,0.03)_95%)] bg-[size:100%_20px] pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#a8ff00]/50 to-transparent animate-pulse" />

          <motion.div 
            animate={{ 
              textShadow: [
                "0 0 10px rgba(168,255,0,0.2)", 
                "0 0 30px rgba(168,255,0,0.6)", 
                "0 0 10px rgba(168,255,0,0.2)"
              ] 
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-[0.65rem] tracking-[0.6em] text-[#a8ff00] uppercase font-bold mb-4 font-mono"
          >
            // SYSTEM STATUS: RECONFIGURING INDEX
          </motion.div>

          <h2 className="text-5xl sm:text-7xl font-black tracking-tighter text-white font-barlow-condensed leading-none uppercase max-w-xl">
            DROP 01 <span className="text-zinc-800">/</span> COMING SOON
          </h2>

          <p className="mt-6 text-xs sm:text-sm tracking-[0.2em] uppercase text-zinc-500 max-w-md font-medium leading-relaxed">
            Exclusive limited run gear and modular sound systems are currently undergoing final calibration. 
          </p>

          <div className="mt-10 flex flex-wrap gap-4 items-center justify-center">
            <div className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-sm text-[0.65rem] font-mono tracking-widest text-zinc-400 uppercase">
              NET_ACCESS_GRANTED: <span className="text-white font-bold">2026_Q3</span>
            </div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileActive={{ scale: 0.98 }}
              className="px-5 py-2.5 bg-[#a8ff00] text-black font-bold text-[0.65rem] tracking-[0.2em] rounded-sm cursor-pointer shadow-[0_0_20px_rgba(168,255,0,0.15)] hover:shadow-[0_0_35px_rgba(168,255,0,0.4)] transition-all duration-300"
            >
              NOTIFY VIA COMM-LINK
            </motion.div>
          </div>
        </motion.div>
      ) : (
        /* --- PRODUCTION ACTIVE STOREFRONT GRID --- */
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-16 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {merchItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative bg-[#0d0d0d] border border-zinc-900 rounded-sm overflow-hidden flex flex-col h-full"
            >
              {/* Product Visual Area */}
              <div className="relative aspect-square w-full bg-zinc-950 overflow-hidden flex items-center justify-center border-b border-zinc-900">
                {item.tag && (
                  <div 
                    className="absolute top-4 left-4 z-10 text-[0.55rem] font-bold tracking-[0.25em] px-2 py-1 uppercase rounded-xs"
                    style={{ backgroundColor: item.color, color: item.color === "#f0f0f0" ? "#000" : "#000" }}
                  >
                    {item.tag}
                  </div>
                )}
                
                {/* Fallback pattern until you drop actual graphics in your public folder */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/40 to-black pointer-events-none z-0" />
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                  className="w-24 h-24 border border-zinc-800 flex items-center justify-center text-[0.6rem] text-zinc-700 font-mono tracking-widest uppercase select-none rounded-sm"
                >
                  NO_IMG
                </motion.div>
              </div>

              {/* Product Information Framework Footer */}
              <div className="p-5 flex flex-col justify-between flex-grow bg-black/40">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-base font-bold tracking-[0.08em] text-[#f0f0f0] font-barlow-condensed uppercase">
                    {item.name}
                  </h3>
                  <span className="text-base font-medium font-barlow-condensed tracking-wider text-[#a8ff00]">
                    €{item.price}
                  </span>
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAdd(item.id, item.name, item.price)}
                  disabled={added[item.id]}
                  className={`mt-6 w-full py-3 rounded-sm border font-bold text-[0.65rem] tracking-[0.25em] uppercase font-barlow-condensed transition-all duration-200 cursor-pointer ${
                    added[item.id]
                      ? "bg-[#a8ff00] border-[#a8ff00] text-black"
                      : "bg-transparent border-zinc-800 text-zinc-400 hover:text-white hover:border-white"
                  }`}
                >
                  {added[item.id] ? "✓ ADDED" : "ADD TO CART"}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Global Shipping Policy Banner Line */}
      <div className="mt-16 text-center text-[0.6rem] font-mono tracking-[0.3em] text-zinc-600 uppercase border-t border-zinc-900/60 pt-8">
        FREE SHIPPING ON GLOBAL ORDERS OVER €150 · LIMITED RUNS · NO RESTOCKS
      </div>
    </div>
  );
}