"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import SectionHeader from "@/components/SectionHeader";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

// PRODUCTION TOGGLE: Flip to false when your shop is ready to go live
const COMING_SOON = true;

export default function MerchPage() {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [added, setAdded] = useState<{ [key: number]: boolean }>({});

  const handleAdd = (id: number, name: string, price: number) => {
    addToCart({ id, name, price });
    setAdded((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAdded((prev) => ({ ...prev, [id]: false }));
    }, 1500);
  };

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
      <SectionHeader label={t("merch_label")} sub={t("merch_sub")} />

      {COMING_SOON ? (
        /* --- HIGH CONVERTING LIFESTYLE GATESVIEW --- */
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-16 relative overflow-hidden border border-zinc-900 bg-[#050505]/60 backdrop-blur-xl rounded-sm p-8 sm:p-24 flex flex-col items-center justify-center text-center min-h-[480px]"
        >
          {/* Ambient Lighting Lines Treatment */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_97%,rgba(168,255,0,0.01)_97%)] bg-[size:100%_30px] pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#a8ff00]/20 to-transparent" />

          <span className="text-[0.65rem] tracking-[0.4em] text-[#a8ff00] uppercase font-black mb-4">
            {t("merch_exclusive")}
          </span>

          <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-barlow-condensed leading-none uppercase max-w-2xl">
            {t("merch_title")}
          </h2>

          <p className="mt-4 text-xs sm:text-sm text-zinc-400 max-w-md font-medium leading-relaxed font-sans">
            {t("merch_desc")}
          </p>

          <div className="mt-8">
            <Link href="/register" passHref legacyBehavior>
              <motion.a 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block bg-[#a8ff00] text-black font-black text-xs tracking-[0.25em] px-8 py-4 rounded-sm uppercase transition-all duration-300 shadow-[0_0_30px_rgba(168,255,0,0.15)] hover:shadow-[0_0_50px_rgba(168,255,0,0.35)] hover:bg-[#b5ff24] cursor-pointer font-mono"
              >
                {t("merch_cta")}
              </motion.a>
            </Link>
          </div>

          <div className="mt-6 text-[0.6rem] tracking-widest text-zinc-600 uppercase font-mono font-bold">
            {t("merch_meta")}
          </div>
        </motion.div>
      ) : (
        /* --- ACTIVE STORE GRID VIEWPORT --- */
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-16 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {merchItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-[#0d0d0d] border border-zinc-900 rounded-sm overflow-hidden flex flex-col h-full hover:border-zinc-800 transition-colors"
            >
              <div className="relative aspect-square w-full bg-zinc-950 overflow-hidden flex items-center justify-center border-b border-zinc-900">
                {item.tag && (
                  <div 
                    className="absolute top-4 left-4 z-10 text-[0.55rem] font-bold tracking-wider px-2 py-1 uppercase rounded-xs text-black"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.tag}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/20 to-black pointer-events-none z-0" />
                <div className="w-24 h-24 border border-zinc-800 flex items-center justify-center text-[0.6rem] text-zinc-600 tracking-widest uppercase select-none rounded-sm font-bold font-mono">
                  {t("merch_pending_media")}
                </div>
              </div>

              <div className="p-5 flex flex-col justify-between flex-grow bg-black/40">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-base font-bold tracking-wide text-[#f0f0f0] uppercase font-barlow-condensed">
                    {item.name}
                  </h3>
                  <span className="text-base font-bold tracking-wide text-[#a8ff00] font-barlow-condensed">
                    €{item.price}
                  </span>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAdd(item.id, item.name, item.price)}
                  disabled={added[item.id]}
                  className={`mt-6 w-full py-3.5 rounded-sm border font-black text-[0.65rem] tracking-widest uppercase transition-all duration-200 cursor-pointer ${
                    added[item.id]
                      ? "bg-[#a8ff00] border-[#a8ff00] text-black"
                      : "bg-transparent border-zinc-800 text-zinc-400 hover:text-white hover:border-white"
                  }`}
                >
                  {added[item.id] ? t("merch_in_cart") : t("merch_add_to_cart")}
                </motion.button>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Footer Banner */}
      <div className="mt-16 text-center text-[0.6rem] font-mono tracking-[0.25em] text-zinc-600 uppercase border-t border-zinc-900/60 pt-8 font-bold">
        {t("merch_footer")}
      </div>
    </div>
  );
}