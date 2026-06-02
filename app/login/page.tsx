"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import SectionHeader from "@/components/SectionHeader";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/dashboard",
        redirect: true,
      });
      
      if (res?.error) {
        setError("Invalid credentials. Access denied.");
      }
    } catch (err) {
      setError("An unexpected authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-24 px-4 sm:px-10 max-w-[1100px] mx-auto">
      <div className="max-w-2xl">
        {/* Adjusted to accept standard props matching your core framework structure */}
        <SectionHeader label="LOGIN" sub="ACCESS · ACCOUNT · BOOKINGS" />

        <div className="mt-12 grid gap-6">
          {/* GOOGLE FEDERATION AUTHORIZATION GATEWAY */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center rounded-sm border border-zinc-800 bg-zinc-950/50 py-3.5 px-4 font-bold tracking-[0.15em] text-xs uppercase text-white hover:bg-zinc-900 hover:border-zinc-700 transition-all duration-300 gap-3"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c6.338 0 10.545-4.458 10.545-10.715 0-.722-.075-1.275-.165-1.826H12.24z" />
            </svg>
            CONTINUE WITH GOOGLE
          </button>

          <div className="relative flex items-center justify-center my-2">
            <div className="absolute w-full border-t border-zinc-900" />
            <span className="relative bg-black px-4 text-[0.55rem] font-mono tracking-[0.3em] text-zinc-600 uppercase">
              OR INTERCEPT VIA CREDENTIALS
            </span>
          </div>

          {/* LIVE SECURE AUTHENTICATION FORM */}
          <form onSubmit={handleCredentialsSubmit} className="grid gap-4">
            {error && (
              <div className="text-[#ff0055] font-mono text-xs tracking-wider border border-[#ff0055]/30 bg-[#ff0055]/5 px-4 py-3 rounded-sm">
                {error}
              </div>
            )}

            <div className="grid gap-1.5">
              <span className="text-[0.65rem] tracking-[0.2em] uppercase text-zinc-500 font-bold">
                EMAIL
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full bg-zinc-950/40 border border-zinc-900 rounded-sm px-4 py-3 text-sm tracking-wide text-white focus:outline-none focus:border-[#a8ff00] transition-colors duration-300 font-mono"
              />
            </div>

            <div className="grid gap-1.5">
              <span className="text-[0.65rem] tracking-[0.2em] uppercase text-zinc-500 font-bold">
                PASSWORD
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-zinc-950/40 border border-zinc-900 rounded-sm px-4 py-3 text-sm tracking-wide text-white focus:outline-none focus:border-[#a8ff00] transition-colors duration-300 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 rounded-sm bg-[#a8ff00] py-3.5 px-4 font-bold tracking-[0.2em] text-xs uppercase text-black hover:bg-[#baff3b] shadow-[0_0_25px_rgba(168,255,0,0.1)] hover:shadow-[0_0_35px_rgba(168,255,0,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "AUTHENTICATING..." : "SIGN IN"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}