import React from "react";
import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";

// Unified client provider architecture
import Providers from "@/components/Providers";

// Core Platform Shell Components
import Nav from "@/components/Nav";
import AudioPlayer from "@/components/AudioPlayer";
import ParallaxBackground from "@/components/ParallaxBackground";
import CookieConsent from "@/components/CookieConsent";
import LanguageGate from "@/components/LanguageGate"; // Injected entry shield

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-barlow",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-barlow-condensed",
});

export const metadata: Metadata = {
  title: "Carlos Cruces | Premium Audio & Visual Archive",  
  description: "Explore the sonic world of Carlos Cruces. Stream exclusive underground electronic music, discover design aesthetics, and access high-fidelity digital discography collections.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Cruces Music",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${barlow.variable} ${barlowCondensed.variable} antialiased bg-black text-[#f0f0f0] font-barlow-condensed overflow-x-hidden`}
      >
        {/* All contextual data structures hydrate cleanly inside this layer */}
        <Providers>
          
          {/* The Gate intercepts un-profiled visitors before page assets mount */}
          <LanguageGate />

          <div className="relative min-h-screen">
            {/* Ambient Background & Global Framework UI */}
            <ParallaxBackground />
            <Nav />
            
            {/* Active Sub-Route Content Viewport */}
            <main>{children}</main>
            
            {/* Persistent Audio Engine Interface */}
            <AudioPlayer />
            
            {/* Global User Privacy Compliance Ledger */}
            <CookieConsent />
          </div>

        </Providers>
      </body>
    </html>
  );
}