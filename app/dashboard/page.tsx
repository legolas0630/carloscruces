"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Protect the route on the client side
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-[0.7rem] font-mono tracking-[0.4em] text-[#a8ff00] animate-pulse">
          INITIALIZING SECURE NODE...
        </div>
      </div>
    );
  }

  // Premium Mock Data - Easily link this to a backend database/Stripe API later
  const premiumPerks = {
    tier: "ASCENDANT (VIP)",
    nodeId: "CC-9082-X",
    expeditions: [
      { id: 1, location: "Icelandic Highlands - Audio Capture", date: "AUG 2026", status: "CONFIRMED" },
      { id: 2, location: "Atacama Desert - Astro-Visuals", date: "NOV 2026", status: "PENDING" },
    ],
    vaultDownloads: [
      { name: "TRANSCEND_Master_24bit_WAV.zip", size: "1.4 GB" },
      { name: "Cinematic_LUT_Pack_v2.cube", size: "42 MB" },
    ],
  };

  return (
    <div className="min-h-screen py-24 px-4 sm:px-10 max-w-[1200px] mx-auto font-mono">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-[#1a1a1a] pb-8">
        <div>
          <span className="text-[0.6rem] text-[#a8ff00] uppercase tracking-[0.3em] font-bold">
            CORE CONTROL TERMINAL // NODE: {premiumPerks.nodeId}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2 uppercase font-barlow-condensed">
            Welcome, {session?.user?.name || "Explorer"}
          </h1>
          <p className="text-zinc-500 text-xs mt-1">
            Authenticated via {session?.user?.email}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="bg-[#a8ff00]/10 border border-[#a8ff00]/30 text-[#a8ff00] px-3 py-1.5 rounded-sm text-[0.65rem] font-bold tracking-widest">
            STATUS: {premiumPerks.tier}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/logout/successful" })}
            className="border border-zinc-800 hover:border-red-500 hover:text-red-500 text-zinc-400 px-4 py-1.5 rounded-sm text-[0.65rem] tracking-wider transition-colors uppercase"
          >
            Disconnect
          </button>
        </div>
      </div>

      {/* Grid Dashboard Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
        
        {/* Module 1: Premium Vault (Downloads) */}
        <div className="lg:col-span-2 bg-[#111] border border-[#1a1a1a] p-6 rounded-sm shadow-[0_0_0_1px_rgba(168,255,0,0.02)]">
          <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-4 mb-4">
            <h2 className="text-[0.75rem] font-bold tracking-[0.25em] text-[#a8ff00] uppercase">
              // THE VAULT (EXCLUSIVE CONTENT)
            </h2>
            <span className="text-[0.55rem] text-zinc-600 uppercase">Vault Node 01</span>
          </div>
          <p className="text-zinc-400 text-xs mb-6 leading-relaxed">
            Your premium tier grants you access to uncompressed production masters, raw logs, and exclusive filmmaker visual preset configurations.
          </p>
          <div className="space-y-3">
            {premiumPerks.vaultDownloads.map((file, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-[#222] hover:border-[#a8ff00]/40 transition-colors group"
              >
                <div>
                  <p className="text-sm text-zinc-200 font-sans tracking-wide group-hover:text-white transition-colors">
                    {file.name}
                  </p>
                  <p className="text-[0.6rem] text-zinc-600 mt-0.5">SIZE: {file.size} — FORMAT: ASSET ARCHIVE</p>
                </div>
                <button className="text-[0.65rem] font-bold tracking-widest bg-zinc-900 border border-zinc-700 text-zinc-300 hover:bg-[#a8ff00] hover:text-black hover:border-[#a8ff00] px-4 py-2 transition-all">
                  DOWNLOAD
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Module 2: Account Access Quick Links */}
        <div className="bg-[#111] border border-[#1a1a1a] p-6 rounded-sm flex flex-col justify-between">
          <div>
            <div className="border-b border-[#1a1a1a] pb-4 mb-4">
              <h2 className="text-[0.75rem] font-bold tracking-[0.25em] text-[#a8ff00] uppercase">
                // TELEMETRY & BOOKINGS
              </h2>
            </div>
            <p className="text-zinc-400 text-xs mb-6 leading-relaxed">
              Expeditions, studio telemetry schedules, and custom commission slots can be initiated directly below.
            </p>
            <div className="space-y-2">
              <Link href="/merch" className="block text-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 py-3 text-[0.65rem] font-bold tracking-[0.2em] uppercase transition-colors">
                Premium Store Access
              </Link>
              <Link href="/expeditions" className="block text-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 py-3 text-[0.65rem] font-bold tracking-[0.2em] uppercase transition-colors">
                Book Expeditions Slot
              </Link>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-[#1a1a1a] text-[0.6rem] text-zinc-600 leading-tight">
            SYSTEM STATUS: OPERATIONAL<br />
            SECURE LINK COMPLIANT WITH AUTH.JS ENGINE v5
          </div>
        </div>

        {/* Module 3: Expedition Logistics (Full Width Bottom Option) */}
        <div className="lg:col-span-3 bg-[#111] border border-[#1a1a1a] p-6 rounded-sm">
          <div className="border-b border-[#1a1a1a] pb-4 mb-4">
            <h2 className="text-[0.75rem] font-bold tracking-[0.25em] text-[#a8ff00] uppercase">
              // ACTIVE EXPEDITION SCHEDULES & PASSES
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-400">
              <thead>
                <tr className="border-b border-[#222] text-[#666] text-[0.6rem] tracking-[0.2em] uppercase">
                  <th className="pb-3 font-medium">Location / Venture</th>
                  <th className="pb-3 font-medium">Timeline</th>
                  <th className="pb-3 font-medium text-right">Clearance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {premiumPerks.expeditions.map((exp) => (
                  <tr key={exp.id} className="group hover:bg-[#0c0c0c] transition-colors">
                    <td className="py-4 text-zinc-200 font-sans font-medium">{exp.location}</td>
                    <td className="py-4 font-mono text-zinc-400">{exp.date}</td>
                    <td className="py-4 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded-sm text-[0.55rem] font-bold tracking-widest ${
                        exp.status === "CONFIRMED" 
                          ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" 
                          : "bg-amber-500/10 border border-amber-500/30 text-amber-400"
                      }`}>
                        {exp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}