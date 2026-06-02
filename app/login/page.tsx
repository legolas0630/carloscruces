"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push("/login/successful");
  };

  return (
    <div className="min-h-screen py-24 px-4 sm:px-10 max-w-[1100px] mx-auto">
      <div className="max-w-2xl">
        <SectionHeader label="LOGIN" sub="ACCESS · ACCOUNT · BOOKINGS" />

        <div className="mt-12 grid gap-6">
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
                  className="w-full bg-[#0a0a0a] border border-[#222] rounded-sm px-4 py-3 text-[#f0f0f0] outline-none focus:border-[#a8ff00] focus:shadow-[0_0_0_1px_rgba(168,255,0,0.15)]"
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
                  className="w-full bg-[#0a0a0a] border border-[#222] rounded-sm px-4 py-3 text-[#f0f0f0] outline-none focus:border-[#a8ff00] focus:shadow-[0_0_0_1px_rgba(168,255,0,0.15)]"
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
