"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Locale } from "@/lib/translations";

export default function LanguageSelector() {
  const { locale, setLocale } = useLanguage();

  const languageNames: Record<Locale, string> = {
    en: "EN",
    es: "ES",
    fr: "FR",
    pt: "PT",
    ja: "JA",
    zh: "ZH",
    de: "DE",
    hi: "HI",
    ar: "AR"
  };

  return (
    <div className="relative inline-block select-none font-mono">
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="bg-transparent text-xs font-bold tracking-widest border border-white/10 hover:border-[#a8ff00] text-zinc-300 hover:text-white px-2.5 py-1 rounded-sm cursor-pointer outline-none transition-all duration-200 appearance-none text-center min-w-[54px]"
        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
      >
        {Object.keys(languageNames).map((lang) => (
          <option key={lang} value={lang} className="bg-[#0f0f0f] text-zinc-300 font-mono text-xs">
            {languageNames[lang as Locale]}
          </option>
        ))}
      </select>
    </div>
  );
}