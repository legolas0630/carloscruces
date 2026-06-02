"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { PlayerProvider } from "@/context/PlayerContext"; // Adjust path if it's in context/ now
import { CartProvider } from "@/context/CartContext";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <PlayerProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </PlayerProvider>
    </SessionProvider>
  );
}