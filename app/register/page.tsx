"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SectionHeader from "@/components/SectionHeader";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push("/login/successful");
  };

  return (
    <div className="min-h-screen py-24 px-4 sm:px-10 max-w-[1100px] mx-auto">
      <div className="max-w-2xl">
        <SectionHeader label="REGISTER" sub="CREATE · ACCOUNT · ACCESS" />

        <div className="mt-12 grid gap-6">
          <form
            onSubmit={handleSubmit}
            className="bg-[#111] border border-[#1a1a1a] rounded-sm p-6 sm:p-8 shadow-[0_0_0_1px_rgba(168,255,0,0.06)]"
          >
            <div className="grid gap-5">
              <label className="grid gap-2">
                <span className="text-[0.65rem] tracking-[0.3em] uppercase text-[#666]">
                  Name
                </span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  className="w-full bg-[#0a0a0a] border border-[#222] rounded-sm px-4 py-3 text-[#f0f0f0] outline-none focus:border-[#a8ff00] focus:shadow-[0_0_0_1px_rgba(168,255,0,0.15)]"
                />
              </label>

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
                  autoComplete="new-password"
                  placeholder="Create a password"
                  className="w-full bg-[#0a0a0a] border border-[#222] rounded-sm px-4 py-3 text-[#f0f0f0] outline-none focus:border-[#a8ff00] focus:shadow-[0_0_0_1px_rgba(168,255,0,0.15)]"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-sm border border-[#a8ff00] bg-[#a8ff00] px-5 py-3 text-[0.7rem] font-bold tracking-[0.25em] text-[#0a0a0a] transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                CREATE ACCOUNT
              </button>

              <Link
                href="/login"
                className="text-[0.7rem] tracking-[0.25em] uppercase text-[#777] hover:text-[#a8ff00] transition-colors"
              >
                Back to login
              </Link>
            </div>
          </form>

          <div className="bg-[#111] border border-[#1a1a1a] rounded-sm p-5">
            <div className="text-[0.65rem] tracking-[0.3em] uppercase text-[#666]">
              Next step
            </div>
            <div className="mt-2 text-lg tracking-[0.12em] text-[#f0f0f0]">
              After creating an account, you can continue to the login success page.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
