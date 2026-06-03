"use client";

import React from "react";
import { PlayerProvider } from "@/context/PlayerContext";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext"; // Added translation matrix gateway

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
  
      <LanguageProvider>
        <PlayerProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </PlayerProvider>
      </LanguageProvider>

  );
}