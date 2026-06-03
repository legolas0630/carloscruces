"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("PASSWORDS DO NOT MATCH");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/register/successful");
      } else {
        setError(data.message || "REGISTRATION FAILED. TRY AGAIN.");
        setIsProcessing(false);
      }
    } catch (err) {
      console.error(err);
      setError("NETWORK ERROR. UNABLE TO INITIALISE.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 py-24 relative overflow-hidden select-none">
      {/* Decorative Structural Background Glow Node */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#a8ff00]/5 blur-[120px] pointer-events-none rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[420px] bg-[#090909]/80 border border-white/5 p-8 rounded-sm shadow-2xl relative z-10"
        style={{ backdropFilter: "blur(12px)" }}
      >
        <div className="text-center mb-6">
          <div className="text-[0.6rem] tracking-[0.4em] text-zinc-500 mb-2 uppercase font-black">Access Protocol</div>
          <h1 
            style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}
            className="text-4xl font-black tracking-wider text-white uppercase"
          >
            CREATE ACCOUNT
          </h1>
        </div>

        {/* GOOGLE/GMAIL FEDERATION AUTHORIZATION GATEWAY */}
        <div className="grid gap-4 mb-2">
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center rounded-sm border border-zinc-800 bg-zinc-950/50 py-3.5 px-4 font-bold tracking-[0.15em] text-xs uppercase text-white hover:bg-zinc-900 hover:border-zinc-700 transition-all duration-300 gap-3 focus:outline-none"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c6.338 0 10.545-4.458 10.545-10.715 0-.722-.075-1.275-.165-1.826H12.24z" />
            </svg>
            REGISTER WITH GMAIL
          </button>

          <div className="relative flex items-center justify-center my-2">
            <div className="absolute w-full border-t border-zinc-900" />
            <span className="relative bg-[#090909] px-4 text-[0.55rem] font-mono tracking-[0.3em] text-zinc-600 uppercase">
              OR INITIALISE VIA CREDENTIALS
            </span>
          </div>
        </div>

        {/* MANUAL CREDENTIAL FORM TRANSCRIPTS */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              className="p-3 bg-red-950/40 border border-red-500/30 text-red-400 text-[0.65rem] font-bold tracking-[0.15em] text-center uppercase rounded-sm"
            >
              ✕ {error}
            </motion.div>
          )}

          <div className="space-y-1">
            <label className="text-[0.6rem] tracking-[0.2em] text-[#9e9e9e] uppercase font-bold pl-0.5">Producer Name / Alias</label>
            <input 
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
              className="w-full bg-[#111] border border-white/5 px-4 py-3 text-sm text-white rounded-sm focus:outline-none focus:border-[#a8ff00] transition-colors uppercase font-medium placeholder-zinc-700 font-mono"
              placeholder="CARLOS CRUCES"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[0.6rem] tracking-[0.2em] text-[#9e9e9e] uppercase font-bold pl-0.5">Email Terminal Address</label>
            <input 
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-[#111] border border-white/5 px-4 py-3 text-sm text-white rounded-sm focus:outline-none focus:border-[#a8ff00] transition-colors placeholder-zinc-700 font-mono"
              placeholder="name@domain.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[0.6rem] tracking-[0.2em] text-[#9e9e9e] uppercase font-bold pl-0.5">Secure Password Key</label>
            <input 
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-[#111] border border-white/5 px-4 py-3 text-sm text-white rounded-sm focus:outline-none focus:border-[#a8ff00] transition-colors font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[0.6rem] tracking-[0.2em] text-[#9e9e9e] uppercase font-bold pl-0.5">Confirm Password Key</label>
            <input 
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full bg-[#111] border border-white/5 px-4 py-3 text-sm text-white rounded-sm focus:outline-none focus:border-[#a8ff00] transition-colors font-mono"
            />
          </div>

          <motion.button
            whileHover={!isProcessing ? { scale: 1.01, boxShadow: "0 0 20px rgba(168,255,0,0.2)" } : {}}
            whileTap={!isProcessing ? { scale: 0.99 } : {}}
            disabled={isProcessing}
            type="submit"
            className={`w-full py-3.5 bg-[#a8ff00] text-black font-black text-xs tracking-[0.25em] rounded-sm transition-all duration-200 uppercase mt-2 select-none ${
              isProcessing ? "opacity-50 cursor-wait" : "cursor-pointer"
            }`}
          >
            {isProcessing ? "TRANSMITTING SIGNALS..." : "AUTHORISE ACCOUNT"}
          </motion.button>
        </form>

        <div className="mt-6 pt-5 border-t border-white/5 text-center">
          <p className="text-[0.65rem] tracking-[0.15em] text-zinc-500 uppercase font-medium">
            Already registered to frequencies?{" "}
            <Link href="/login" className="text-[#a8ff00] no-underline font-bold hover:underline ml-1">
              LOGIN HERE
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}