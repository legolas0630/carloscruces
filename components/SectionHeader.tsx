import React from "react";

interface SectionHeaderProps {
  label: string;
  sub: string;
}

export default function SectionHeader({ label, sub }: SectionHeaderProps) {
  return (
    <div style={{ borderLeft: "2px solid #a8ff00", paddingLeft: "1rem" }}>
      <h1 style={{ fontFamily: "var(--font-barlow-condensed), sans-serif", fontWeight: 900, fontSize: "clamp(2.5rem,6vw,4rem)", letterSpacing: "0.1em", color: "#f0f0f0", lineHeight: 1 }}>
        {label}
      </h1>
      <div style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 300, fontSize: "0.7rem", letterSpacing: "0.35em", color: "#555", marginTop: "0.4rem" }}>
        {sub}
      </div>
    </div>
  );
}
