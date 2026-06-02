import React from "react";
import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { PlayerProvider } from "@/lib/PlayerContext";
import Nav from "@/components/Nav";
import AudioPlayer from "@/components/AudioPlayer";
import ParallaxBackground from "@/components/ParallaxBackground";

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
  title: "Carlos Cruces | ASCEND · DESCEND · TRANSCEND",
  description: "Official website of Carlos Cruces. Music, Visuals, Expeditions and Merch.",
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
        <PlayerProvider>
          <div className="relative min-h-screen">
            <ParallaxBackground />
            <Nav />
            <main>{children}</main>
            <AudioPlayer />
          </div>
        </PlayerProvider>
      </body>
    </html>
  );
}
