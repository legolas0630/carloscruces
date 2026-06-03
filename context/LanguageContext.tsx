"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Locale, TRANSLATIONS } from "@/lib/translations";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const savedLocale = localStorage.getItem("cc_locale") as Locale;
    if (savedLocale && TRANSLATIONS[savedLocale]) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("cc_locale", newLocale);
    
    // Dynamic RTL handling for Arabic localization integrity
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
  if (!context) throw new Error("useLanguage must be run inside a LanguageProvider container loop.");
  return context;
}