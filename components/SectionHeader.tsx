"use client";

import React from "react";

interface SectionHeaderProps {
  label: string;
  sub: string;
}

export default function SectionHeader({ label, sub }: SectionHeaderProps) {
  return (
    <div className="relative mb-6 select-none">
      {/* Main Large Section Title */}
      <h1 
        style={{ 
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 950,
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          letterSpacing: "0.05em",
          color: "#ffffff",
          textShadow: "0 2px 10px rgba(0,0,0,0.95)"
        }}
        className="tracking-tight uppercase leading-none"
      >
        {label}
      </h1>

      {/* Sub-heading Title — Optimized for High-Frequency Noise Isolation */}
      <p 
        style={{ 
          fontFamily: "var(--font-barlow-condensed), sans-serif",
          fontWeight: 600,
          fontSize: "clamp(0.65rem, 1.5vw, 0.8rem)",
          letterSpacing: "0.4em",
          color: "#a2a2a2", // Lifted to light charcoal silver for distinct clarity
          textShadow: "0 2px 6px rgba(0,0,0,1)", // Isolates the sub-header against screen static
          marginTop: "0.5rem"
        }}
        className="uppercase tracking-widest leading-none"
      >
        {sub}
      </p>
    </div>
  );
}