"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const amountFromUrl = searchParams.get("amount");
  const [amount, setAmount] = useState<string>(amountFromUrl || "45.00"); // Standard mock value if null
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "mercadopago" | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Form states to elevate premium user data capture
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "MX",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePaymentSubmit = async (method: "stripe" | "mercadopago") => {
    if (!formData.email || !formData.fullName) {
      alert("Please complete the required Manifest Identity fields.");
      return;
    }
    
    setPaymentMethod(method);
    setLoading(true);

    try {
      const endpoint = method === "stripe" ? "/api/stripe/checkout" : "/api/mercadopago/preference";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: parseFloat(amount),
          customerInfo: formData 
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Payment initialization failed");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error processing transaction:", error);
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 text-left mt-16">
      
      {/* LEFT COLUMN: IDENTITY & TRANSMISSION FORMS (7 Cols) */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="lg:col-span-7 space-y-8"
      >
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-[#a8ff00] uppercase">
            SECURE TERMINAL
          </h1>
          <p className="text-zinc-500 tracking-[0.2em] text-xs uppercase mt-1">
            Review manifest entries & validate access parameters
          </p>
        </div>

        {/* Section 1: Identity Allocation */}
        <div className="border border-zinc-800 bg-zinc-950/40 backdrop-blur-md p-6 rounded-sm">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 bg-[#a8ff00] rounded-full animate-pulse" />
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-white">01. Identity Parameters</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.65rem] tracking-widest text-zinc-500 uppercase mb-2">Legal Name</label>
              <input 
                type="text" name="fullName" required value={formData.fullName} onChange={handleInputChange}
                className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-[#a8ff00] text-sm text-white px-4 py-3 outline-none transition-colors duration-200 rounded-sm"
                placeholder="Carlos Cruces"
              />
            </div>
            <div>
              <label className="block text-[0.65rem] tracking-widest text-zinc-500 uppercase mb-2">Transmission Email</label>
              <input 
                type="email" name="email" required value={formData.email} onChange={handleInputChange}
                className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-[#a8ff00] text-sm text-white px-4 py-3 outline-none transition-colors duration-200 rounded-sm"
                placeholder="carlos@frequencies.com"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Physical Manifest Delivery (Merch Shipping) */}
        <div className="border border-zinc-800 bg-zinc-950/40 backdrop-blur-md p-6 rounded-sm">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 bg-[#a8ff00] rounded-full" />
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-white">02. Physical Destination (Merch / Vinyl)</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-[0.65rem] tracking-widest text-zinc-500 uppercase mb-2">Street Address</label>
              <input 
                type="text" name="address" value={formData.address} onChange={handleInputChange}
                className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-[#a8ff00] text-sm text-white px-4 py-3 outline-none transition-colors duration-200 rounded-sm"
                placeholder="Av. Central 123"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[0.65rem] tracking-widest text-zinc-500 uppercase mb-2">City</label>
                <input 
                  type="text" name="city" value={formData.city} onChange={handleInputChange}
                  className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-[#a8ff00] text-sm text-white px-4 py-3 outline-none transition-colors duration-200 rounded-sm"
                  placeholder="CDMX"
                />
              </div>
              <div>
                <label className="block text-[0.65rem] tracking-widest text-zinc-500 uppercase mb-2">Postal Code</label>
                <input 
                  type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange}
                  className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-[#a8ff00] text-sm text-white px-4 py-3 outline-none transition-colors duration-200 rounded-sm"
                  placeholder="01000"
                />
              </div>
              <div>
                <label className="block text-[0.65rem] tracking-widest text-zinc-500 uppercase mb-2">Region / Country</label>
                <select 
                  name="country" value={formData.country} onChange={handleInputChange}
                  className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-[#a8ff00] text-sm text-white px-4 py-3 outline-none transition-colors duration-200 rounded-sm h-[46px]"
                >
                  <option value="MX">Mexico (Mercado Pago friendly)</option>
                  <option value="US">United States</option>
                  <option value="AR">Argentina</option>
                  <option value="BR">Brazil</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Gateway Secure Execution */}
        <div className="border border-zinc-800 bg-zinc-950/40 backdrop-blur-md p-6 rounded-sm">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 bg-[#a8ff00] rounded-full" />
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-white">03. Authorize Gateway Router</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => handlePaymentSubmit("stripe")}
              disabled={loading}
              className="w-full bg-white text-black py-4 text-[0.65rem] font-bold tracking-[0.4em] uppercase hover:bg-[#a8ff00] transition-all duration-300 rounded-sm disabled:opacity-50 font-mono"
            >
              {loading && paymentMethod === "stripe" ? "ROUTING STRIPE..." : "EXECUTE STRIPE (GLOBAL)"}
            </button>

            <button
              onClick={() => handlePaymentSubmit("mercadopago")}
              disabled={loading}
              className="w-full border border-zinc-700 text-zinc-300 py-4 text-[0.65rem] font-bold tracking-[0.4em] uppercase hover:border-[#a8ff00] hover:text-[#a8ff00] transition-all duration-300 rounded-sm disabled:opacity-50 font-mono"
            >
              {loading && paymentMethod === "mercadopago" ? "ROUTING MPAGO..." : "EXECUTE MERCADO PAGO (LATAM)"}
            </button>
          </div>
          
          <div className="mt-4 flex items-center justify-center gap-2 text-[0.55rem] text-zinc-600 uppercase tracking-[0.2em]">
            <span>🔒 Encrypted Core SSL</span>
            <span>•</span>
            <span>Verified Terminal Response</span>
          </div>
        </div>
      </motion.div>

      {/* RIGHT COLUMN: MANIFEST SUMMARY (5 Cols) */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="lg:col-span-5 space-y-6"
      >
        <div className="border border-zinc-800 bg-zinc-950/70 backdrop-blur-md p-6 rounded-sm sticky top-24">
          <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-zinc-400 mb-6 pb-2 border-b border-zinc-900">
            Manifest Inventory
          </h2>

          {/* Dynamic Mock Items Allocation List */}
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-start text-xs">
              <div>
                <p className="text-white font-bold uppercase tracking-wider">Cumbia Malice - Special Edition Vinyl</p>
                <p className="text-zinc-500 text-[0.65rem] mt-0.5">Physical Format Release Allocation</p>
              </div>
              <span className="text-zinc-300 font-mono">$35.00</span>
            </div>
            <div className="flex justify-between items-start text-xs">
              <div>
                <p className="text-white font-bold uppercase tracking-wider">Digital WAV Master Frequencies</p>
                <p className="text-zinc-500 text-[0.65rem] mt-0.5">High-fidelity 24-bit direct audio node</p>
              </div>
              <span className="text-zinc-300 font-mono">$10.00</span>
            </div>
          </div>

          {/* Ledger Calculation Breakdown */}
          <div className="border-t border-zinc-900 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-zinc-500 uppercase tracking-wider">
              <span>Subtotal Cost</span>
              <span className="font-mono">${amount}</span>
            </div>
            <div className="flex justify-between text-zinc-500 uppercase tracking-wider">
              <span>Encrypted Node Processing Fee</span>
              <span className="font-mono text-[#a8ff00]">$0.00</span>
            </div>
            <div className="flex justify-between text-zinc-500 uppercase tracking-wider">
              <span>Logistics Delivery</span>
              <span className="font-mono text-zinc-400">Calculated Next</span>
            </div>
            
            <div className="border-t border-zinc-800 mt-4 pt-4 flex justify-between items-center">
              <span className="text-zinc-300 font-bold uppercase tracking-[0.2em] text-xs">Total Manifest Cost</span>
              <span className="text-[#a8ff00] font-mono text-2xl font-black">${amount}</span>
            </div>
          </div>

          <div className="mt-8">
            <Link 
              href="/cart"
              className="block w-full text-center border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600 py-3 text-[0.6rem] font-bold tracking-[0.3em] uppercase transition-all duration-200 rounded-sm"
            >
              Abort / Modify Selection
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-start text-center px-4 relative overflow-hidden pb-24">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(168,255,0,0.03)_0%,transparent_60%)] pointer-events-none" />
      
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-500 tracking-[0.4em] text-xs uppercase animate-pulse">
          Synchronizing Secure Terminal Nodes...
        </div>
      }>
        <CheckoutContent />
      </Suspense>
    </div>
  );
}