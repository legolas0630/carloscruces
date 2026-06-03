"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Locale, TRANSLATIONS } from "@/lib/translations";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// ================= LIGHTWEIGHT CLIENT-SIDE COOKIE UTILITIES =================
const getCookie = (name: string): string => {
  if (typeof document === "undefined") return "";
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || "";
  return "";
};

const setCookie = (name: string, value: string, days = 365) => {
  if (typeof document === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;SameSite=Lax;Secure`;
};
// ============================================================================

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // Read cookie configuration state upon client hydration mount
  useEffect(() => {
    const savedLocale = getCookie("cc_locale") as Locale;
    if (savedLocale && TRANSLATIONS[savedLocale]) {
      setLocaleState(savedLocale);
      
      if (typeof document !== "undefined") {
        document.documentElement.dir = savedLocale === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = savedLocale;
      }
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setCookie("cc_locale", newLocale); // Commits cookie header to browser ledger
    
    // Dynamic RTL handling for Arabic localization structural layout alignment
    if (typeof document !== "undefined") {
      document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = newLocale;
    }
  };

  const t = (key: string): string => {
    return TRANSLATIONS[locale]?.[key] || TRANSLATIONS["en"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be run inside a LanguageProvider container loop.");
  }
  return context;
}