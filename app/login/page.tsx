"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import SectionHeader from "@/components/SectionHeader";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Placeholder logic for standard credential submission
    router.push("/login/successful");
  };

  // --- Authenticated Layout View ---
  if (status === "authenticated" && session) {
    return (
      <div className="min-h-screen py-24 px-4 sm:px-10 max-w-[1100px] mx-auto flex items-center justify-center">
        <div className="w-full max-w-md bg-[#111] border border-[#1a1a1a] rounded-sm p-6 sm:p-8 text-center shadow-[0_0_0_1px_rgba(168,255,0,0.06)]">
          <span className="text-[0.6rem] font-mono text-[#a8ff00] uppercase tracking-[0.3em]">
            📡 SECURE AUTHENTICATED NODE
          </span>
          <h2 className="text-xl font-bold uppercase tracking-tight text-white mt-3 mb-1">
            Welcome back, {session.user?.name || "Explorer"}
          </h2>
          <p className="text-[#a8ff00] text-xs font-mono tracking-wide mb-6">
            [{session.user?.email}]
          </p>
          
          <div className="border-t border-[#1a1a1a] pt-6 space-y-3">
            <button
              onClick={() => signOut({ callbackUrl: "/logout/successful" })}
              className="w-full inline-flex items-center justify-center rounded-sm border border-zinc-800 bg-transparent hover:border-red-500 hover:text-red-500 px-5 py-3 text-[0.7rem] font-bold tracking-[0.25em] text-zinc-400 transition-colors"
            >
              DISCONNECT TERMINAL
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Unauthenticated Form View ---
  return (
    <div className="min-h-screen py-24 px-4 sm:px-10 max-w-[1100px] mx-auto">
      <div className="max-w-2xl">
        {/* Adjusted to accept standard props matching your core framework structure */}
        <SectionHeader label="LOGIN" sub="ACCESS · ACCOUNT · BOOKINGS" />

        <div className="mt-12 grid gap-6">
          
          {/* --- GOOGLE FEDERATION AUTHORIZATION GATEWAY --- */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/checkout" })}
            className="w-full flex items-center justify-center gap-3 rounded-sm border border-[#1a1a1a] bg-[#111] hover:bg-white hover:text-black hover:border-white text-[#f0f0f0] py-4 text-[0.7rem] font-bold tracking-[0.25em] uppercase transition-all duration-300 font-mono shadow-[0_0_0_1px_rgba(168,255,0,0.03)]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            CONTINUE WITH GOOGLE
          </button>

          <div className="relative flex items-center justify-center my-2">
            <div className="absolute w-full border-t border-[#1a1a1a]"></div>
            <span className="relative bg-black px-4 text-[0.55rem] font-mono tracking-[0.4em] uppercase text-[#444]">
              OR INTERCEPT VIA CREDENTIALS
            </span>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-[#111] border border-[#1a1a1a] rounded-sm p-6 sm:p-8 shadow-[0_0_0_1px_rgba(168,255,0,0.06)]"
          >
            <div className="grid gap-5">
              <label className="grid gap-2">
                <span className="text-[0.65rem] tracking-[0.3em] uppercase text-[#666]">
                  Email
                </span>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full bg-[#0a0a0a] border border-[#222] rounded-sm px-4 py-3 text-[#f0f0f0] outline-none focus:border-[#a8ff00] focus:shadow-[0_0_0_1px_rgba(168,255,0,0.15)] font-mono text-sm"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[0.65rem] tracking-[0.3em] uppercase text-[#666]">
                  Password
                </span>
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full bg-[#0a0a0a] border border-[#222] rounded-sm px-4 py-3 text-[#f0f0f0] outline-none focus:border-[#a8ff00] focus:shadow-[0_0_0_1px_rgba(168,255,0,0.15)] font-mono text-sm"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-sm border border-[#a8ff00] bg-[#a8ff00] px-5 py-3 text-[0.7rem] font-bold tracking-[0.25em] text-[#0a0a0a] transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                SIGN IN
              </button>

              <Link
                href="/register"
                className="text-[0.7rem] tracking-[0.25em] uppercase text-[#777] hover:text-[#a8ff00] transition-colors"
              >
                Create account
              </Link>
            </div>
          </form>

          {/* --- DEMO DIAGNOSTIC PATH LINKS --- */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/login/successful"
              className="bg-[#111] border border-[#1a1a1a] rounded-sm p-5 hover:border-[#a8ff00] transition-colors"
            >
              <div className="text-[0.65rem] tracking-[0.3em] uppercase text-[#666]">
                Demo
              </div>
              <div className="mt-2 text-lg tracking-[0.12em] text-[#f0f0f0]">
                Login successful page
              </div>
            </Link>

            <Link
              href="/logout/successful"
              className="bg-[#111] border border-[#1a1a1a] rounded-sm p-5 hover:border-[#a8ff00] transition-colors"
            >
              <div className="text-[0.65rem] tracking-[0.3em] uppercase text-[#666]">
                Demo
              </div>
              <div className="mt-2 text-lg tracking-[0.12em] text-[#f0f0f0]">
                Logout successful page
              </div>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}