"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Direct secure execution via browser cookie architecture
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(t("login_err_auth"));
        setLoading(false);
        return;
      }

      if (data?.user) {
        // 2. Programmatic router advance + token refresh verification
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError(t("login_err_fail"));
      setLoading(false);
    }
  };

  const handleGoogleSubmit = async () => {
    setError("");
    try {
      // 3. Initiate federated OAuth handshakes over secure callback boundaries
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (oauthError) {
        setError(oauthError.message);
      }
    } catch (err) {
      setError(t("login_err_fail"));
    }
  };

  return (
    <div className="min-h-screen py-24 px-4 sm:px-10 max-w-[1100px] mx-auto select-none">
      <div className="max-w-2xl text-left">
        <SectionHeader label={t("login_label")} sub={t("login_sub")} />

        <div className="mt-12 grid gap-6">
          {/* GOOGLE INTEGRATION ENTRY */}
          <button
            type="button"
            onClick={handleGoogleSubmit}
            className="w-full flex items-center justify-center rounded-sm border border-zinc-800 bg-zinc-950/50 py-3.5 px-4 font-black tracking-[0.2em] text-xs uppercase text-white hover:bg-zinc-900 hover:border-zinc-700 transition-all duration-300 gap-3 cursor-pointer shadow-xs"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c6.338 0 10.545-4.458 10.545-10.715 0-.722-.075-1.275-.165-1.826H12.24z" />
            </svg>
            {t("login_google")}
          </button>

          <div className="relative flex items-center justify-center my-2">
            <div className="absolute w-full border-t border-zinc-900" />
            <span className="relative bg-black px-4 text-[0.55rem] font-mono tracking-[0.3em] text-zinc-600 uppercase font-bold">
              {t("login_or")}
            </span>
          </div>

          {/* SECURE INPUT CONTROLS */}
          <form onSubmit={handleCredentialsSubmit} className="grid gap-4">
            {error && (
              <div className="text-[#ff0055] font-mono text-xs tracking-wider border border-[#ff0055]/20 bg-[#ff0055]/5 px-4 py-3 rounded-sm font-bold uppercase">
                ⚠️ {error}
              </div>
            )}

            <div className="grid gap-1.5">
              <span className="text-[0.65rem] tracking-[0.2em] uppercase text-zinc-500 font-black">
                {t("login_email")}
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="one-love@vibrations.com"
                className="w-full bg-zinc-950/60 border border-zinc-900 rounded-sm px-4 py-3.5 text-sm tracking-wide text-white focus:outline-none focus:border-[#a8ff00] transition-colors duration-300 font-mono"
              />
            </div>

            <div className="grid gap-1.5">
              <span className="text-[0.65rem] tracking-[0.2em] uppercase text-zinc-500 font-black">
                {t("login_pass")}
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-zinc-950/60 border border-zinc-900 rounded-sm px-4 py-3.5 text-sm tracking-wide text-white focus:outline-none focus:border-[#a8ff00] transition-colors duration-300 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-2 rounded-sm py-4 px-4 font-black tracking-[0.25em] text-xs uppercase text-black transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                loading 
                  ? "bg-zinc-800 border border-zinc-700 text-zinc-500 shadow-none" 
                  : "bg-[#a8ff00] hover:bg-[#baff3b] shadow-[0_0_25px_rgba(168,255,0,0.1)] hover:shadow-[0_0_40px_rgba(168,255,0,0.35)]"
              }`}
            >
              {loading ? t("login_loading") : t("login_btn")}
            </button>
          </form>

          {/* CREATION FUNNEL EXPANSION */}
          <div className="mt-4 pt-4 border-t border-zinc-900/60 text-center">
            <p className="text-[0.65rem] tracking-[0.18em] text-zinc-500 uppercase font-bold">
              {t("login_new")}{" "}
              <Link 
                href="/register" 
                className="text-[#a8ff00] no-underline font-black hover:underline tracking-[0.18em] ml-1 transition-all duration-200"
                style={{ textShadow: "0 0 10px rgba(168,255,0,0.15)" }}
              >
                {t("login_create")}
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}