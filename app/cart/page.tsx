"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "@/components/SectionHeader";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  // Pull actions and reactive live arrays directly from context
  const { cartItems, updateQuantity, removeFromCart, cartCount } = useCart();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = subtotal > 0 ? 8.00 : 0.00;
  const total = subtotal + shipping;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  return (
    <div className="min-h-screen py-24 px-4 sm:px-10 max-w-[1100px] mx-auto">
      <div className="max-w-4xl">
        <SectionHeader label="VIEW CART" sub="YOUR ITEMS · ORDER SUMMARY" />

        <AnimatePresence mode="wait">
          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-12 text-center p-12 bg-[#111] border border-[#1a1a1a] rounded-sm"
            >
              <div className="text-sm tracking-[0.2em] uppercase text-zinc-500 mb-6">
                Your cart is currently empty.
              </div>
              <Link
                href="/merch"
                className="inline-flex items-center justify-center rounded-sm border border-[#a8ff00] bg-[#a8ff00] px-6 py-3 text-[0.7rem] font-bold tracking-[0.25em] text-[#0a0a0a] transition-transform hover:scale-[1.02] active:scale-[0.98] no-underline"
              >
                RETURN TO MERCHANDISE
              </Link>
            </motion.div>
          ) : (
            <div className="mt-12 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
              <div className="bg-[#111] border border-[#1a1a1a] rounded-sm p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-[0.65rem] tracking-[0.3em] uppercase text-zinc-500">
                    Items in cart ({cartCount})
                  </div>
                  <Link
                    href="/merch"
                    className="text-[0.65rem] tracking-[0.3em] uppercase text-zinc-400 hover:text-[#a8ff00] transition-colors no-underline"
                  >
                    Continue shopping
                  </Link>
                </div>

                <div className="mt-6 grid gap-4">
                  <AnimatePresence>
                    {cartItems.map((item) => (
                      <motion.div
                        key={`${item.id}-${item.variant || "default"}`}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#1a1a1a] rounded-sm p-4 bg-[#0a0a0a]"
                      >
                        <div>
                          <div className="text-base sm:text-lg tracking-[0.1em] text-[#f0f0f0]">
                            {item.name}
                          </div>
                          {item.variant && (
                            <div className="text-[0.6rem] text-zinc-500 tracking-wider uppercase mt-0.5">
                              Size: {item.variant}
                            </div>
                          )}
                          
                          <div className="mt-3 flex items-center gap-4">
                            <div className="flex items-center border border-zinc-800 rounded-sm bg-black">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.qty - 1)}
                                className="px-3 py-1 text-zinc-400 hover:text-white transition-colors text-xs font-bold bg-transparent border-none cursor-pointer"
                              >
                                −
                              </button>
                              <span className="px-2 text-xs font-barlow-condensed tracking-[0.1em] text-white select-none">
                                {item.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.qty + 1)}
                                className="px-3 py-1 text-zinc-400 hover:text-white transition-colors text-xs font-bold bg-transparent border-none cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="text-[0.6rem] uppercase tracking-[0.2em] text-zinc-600 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        <div className="text-right flex sm:flex-col justify-between sm:justify-center items-center sm:items-end border-t border-zinc-900 sm:border-none pt-2 sm:pt-0">
                          <span className="sm:hidden text-[0.6rem] text-zinc-600 uppercase tracking-widest">Subtotal</span>
                          <div className="text-sm sm:text-base tracking-[0.15em] text-[#a8ff00] font-medium font-barlow-condensed">
                            {formatCurrency(item.price * item.qty)}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <aside className="bg-[#111] border border-[#1a1a1a] rounded-sm p-6 sm:p-8 h-fit sticky top-24">
                <div className="text-[0.65rem] tracking-[0.3em] uppercase text-zinc-500">
                  Summary
                </div>

                <div className="mt-6 grid gap-3 text-sm">
                  <div className="flex items-center justify-between text-zinc-400 font-barlow-condensed tracking-[0.05em]">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400 font-barlow-condensed tracking-[0.05em]">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "FREE" : formatCurrency(shipping)}</span>
                  </div>
                  <div className="border-t border-[#1a1a1a] pt-3 flex items-center justify-between text-[#f0f0f0] font-barlow-condensed tracking-[0.05em]">
                    <span className="font-bold">Total</span>
                    <span className="text-[#a8ff00] font-bold text-base">{formatCurrency(total)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="mt-8 inline-flex w-full items-center justify-center rounded-sm border border-[#a8ff00] bg-[#a8ff00] px-5 py-3 text-[0.7rem] font-bold tracking-[0.25em] text-[#0a0a0a] transition-transform hover:scale-[1.02] active:scale-[0.98] no-underline"
                >
                  PROCEED TO CHECKOUT
                </Link>
              </aside>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}