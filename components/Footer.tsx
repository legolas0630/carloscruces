"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-zinc-900 bg-black py-8 px-6 font-mono text-[10px] tracking-widest text-zinc-600 select-none mt-auto relative z-10 transform-gpu">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Core Node Telemetry Status */}
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>SYS_STATUS: OPERATIONAL // NETWORK_NODE_ ({currentYear})</span>
        </div>

        {/* Legal Resource Hyperlinks */}
        <div className="flex items-center gap-6">
          <Link 
            href="/privacy" 
            className="hover:text-[#a8ff00] uppercase transition-colors duration-200 no-underline"
          >
            PRIVACY_MANIFEST
          </Link>
          <span className="text-zinc-800 select-none">|</span>
          <Link 
            href="/terms" 
            className="hover:text-[#a8ff00] uppercase transition-colors duration-200 no-underline"
          >
            TERMS_MATRIX
          </Link>
        </div>

        {/* Identity Signature */}
        <div className="uppercase text-zinc-500 tracking-[0.2em]">
          CARLOS CRUCES © ALL_PRIVILEGES_RESERVED
        </div>

      </div>
    </footer>
  );
}