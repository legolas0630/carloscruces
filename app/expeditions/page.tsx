"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "@/components/SectionHeader";

// Mock Data structure for upcoming physical manifestations
interface ExpeditionNode {
  id: string;
  title: string;
  location: string;
  elevation: string;
  dateCode: string; // YYYY-MM-DD format for logical checking
  dateDisplay: string;
  spotsTotal: number;
  spotsRegistered: number;
  status: "active" | "full" | "concluded";
  coordinates: string;
  description: string;
}

const UPCOMING_NODES: ExpeditionNode[] = [
  {
    id: "node-01",
    title: "Sierra Madre – Ridge Isolation Tour",
    location: "Guanajuato Highlands, MX",
    elevation: "2,800m",
    dateCode: "2026-07-15",
    dateDisplay: "JULY 15 - 18, 2026",
    spotsTotal: 8,
    spotsRegistered: 5,
    status: "active",
    coordinates: "21.0181° N, 101.2574° W",
    description: "Wind strips everything back to pure signal. High-altitude wilderness backpacking focused on absolute silence, ambient field recording workshops, and raw tracking exercises.",
  },
  {
    id: "node-02",
    title: "Meditation On Machinery",
    location: "Mineral de Pozos, MX",
    elevation: "2,300m",
    dateCode: "2026-08-22",
    dateDisplay: "AUG 22 - 24, 2026",
    spotsTotal: 6,
    spotsRegistered: 6,
    status: "full",
    coordinates: "21.2212° N, 100.4892° W",
    description: "Navigating deep subterranean acoustics and abandoned stone infrastructures. An expedition charting ghost frequencies and heavy isolation acoustics.",
  },
  {
    id: "node-03",
    title: "Volcanic Caldera Resonance Extraction",
    location: "Nevado de Toluca, MX",
    elevation: "4,680m",
    dateCode: "2026-10-05",
    dateDisplay: "OCT 05 - 09, 2026",
    spotsTotal: 5,
    spotsRegistered: 1,
    status: "active",
    coordinates: "19.1025° N, 99.7611° W",
    description: "Extreme elevation alpine deployment. Navigating inside the crater floor boundaries alongside the lakes of the Sun and Moon. Severe microclimates.",
  },
];

export default function ExpeditionsPage() {
  const [selectedNode, setSelectedNode] = useState<ExpeditionNode | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>("");

  // Minimal Calendar Configuration Helper (For Current Perspective Mocking)
  // Generating a grid framework representing July 2026
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const startOffsetBlankDays = Array.from({ length: 3 }); // July 2026 starts on a Wednesday

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    
    // In production, connect this fetch transaction hook straight to your database controllers
    setRegisterSuccess(true);
    setTimeout(() => {
      setRegisterSuccess(false);
      setEmailInput("");
      setSelectedNode(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-24 relative overflow-hidden">
      {/* Structural Topography Ambient Background Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-[#a8ff00]/5 to-transparent pointer-events-none blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-16">
        
        {/* --- SECTION 1: HIGH-END SIGNAL HERO HEADER --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left border-b border-zinc-900 pb-12"
        >
          <SectionHeader label="EXPEDITIONS" sub="FIELD RADAR / OUTDOOR DISPLACEMENT TACTICS" />
          
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-7">
              <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-white uppercase leading-none">
                MORE ADVENTURES <br />
                <span className="text-[#a8ff00] animate-pulse">COMING SOON //</span>
              </h2>
            </div>
            <div className="lg:col-span-5 border-l-2 border-[#a8ff00] pl-6 py-2">
              <p className="text-zinc-400 text-xs tracking-widest uppercase font-mono leading-relaxed">
                STATUS: BROADCASTING OPEN LOGISTICS nodes. WE DISPLACE INDIVIDUALS FROM DIGITAL INFRASTRUCTURES INTO SEVERE EARTHBOUND FREQUENCIES. HIKING, BACKPACKING, ISOLATION ENERGETICS.
              </p>
            </div>
          </div>
        </motion.div>

        {/* --- SECTION 2: THE INTERACTIVE EXPEDITION MANIFEST SYSTEM --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Manifest Fleet Index (Left 7 Columns) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-zinc-500 font-mono text-[0.65rem] uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
              <span>●</span> CURRENT OPERATIONAL MANIFESTS
            </h3>
            
            {UPCOMING_NODES.map((node, index) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`border text-left p-6 rounded-sm backdrop-blur-md transition-all duration-300 ${
                  node.status === "full" 
                    ? "border-zinc-900 bg-zinc-950/20 opacity-50" 
                    : "border-zinc-800 bg-zinc-950/60 hover:border-[#a8ff00]/60"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 text-[0.6rem] font-mono text-zinc-500 uppercase tracking-widest mb-1">
                      <span>{node.dateDisplay}</span>
                      <span>•</span>
                      <span className="text-[#a8ff00]">{node.elevation}</span>
                    </div>
                    <h4 className="text-lg font-bold uppercase tracking-tight text-white mb-2">
                      {node.title}
                    </h4>
                    <p className="text-zinc-400 text-xs font-mono tracking-wide line-clamp-2">
                      {node.description}
                    </p>
                    <div className="text-[0.6rem] font-mono text-zinc-600 mt-3 uppercase tracking-wider">
                      📍 LOC: {node.coordinates}
                    </div>
                  </div>

                  <div className="sm:text-right flex sm:flex-col justify-between items-center sm:items-end gap-2 border-t border-zinc-900 sm:border-0 pt-3 sm:pt-0">
                    <span className="text-[0.65rem] font-mono uppercase tracking-wider text-zinc-400">
                      SPOTS: <span className="text-white font-bold">{node.spotsTotal - node.spotsRegistered} AVAILABLE</span> / {node.spotsTotal} TOTAL
                    </span>
                    
                    {node.status === "full" ? (
                      <span className="border border-zinc-800 text-zinc-600 px-4 py-2 text-[0.6rem] font-bold tracking-widest uppercase rounded-sm">
                        NODE FILLED
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedNode(node)}
                        className="bg-[#a8ff00] text-black hover:bg-white px-4 py-2 text-[0.6rem] font-bold tracking-widest uppercase transition-colors duration-200 rounded-sm"
                      >
                        REQUEST ACCESS
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* --- SECTION 3: THE CYBER CALENDAR INTERFACE (Right 5 Columns) --- */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-zinc-500 font-mono text-[0.65rem] uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
              <span>●</span> TEMPORAL NODE INTERCEPT (JULY 2026)
            </h3>

            <div className="border border-zinc-800 bg-zinc-950/40 p-6 rounded-sm backdrop-blur-md">
              <div className="flex justify-between items-center mb-6 border-b border-zinc-900 pb-3">
                <span className="font-mono text-xs text-[#a8ff00] tracking-[0.2em] uppercase font-bold">JULY // 2026</span>
                <span className="text-[0.55rem] font-mono text-zinc-600 uppercase tracking-widest">System Sync: OK</span>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 text-center text-[0.55rem] font-mono text-zinc-500 uppercase tracking-wider mb-2 font-bold">
                <span>Dom</span><span>Lun</span><span>Mar</span><span>Mie</span><span>Jue</span><span>Vie</span><span>Sab</span>
              </div>

              {/* Calendar Dynamic Matrix Grid */}
              <div className="grid grid-cols-7 gap-1.5 text-xs font-mono">
                {/* Blank Offset Days */}
                {startOffsetBlankDays.map((_, i) => (
                  <div key={`blank-${i}`} className="p-2 border border-transparent text-transparent select-none">00</div>
                ))}
                
                {/* Active Grid Days */}
                {calendarDays.map((day) => {
                  // Logic highlights if specific date targets land on expedition allocations (e.g. July 15)
                  const isExpeditionActive = day >= 15 && day <= 18;
                  
                  return (
                    <div
                      key={`day-${day}`}
                      className={`p-2 border text-center relative transition-all duration-200 group rounded-xs ${
                        isExpeditionActive
                          ? "border-[#a8ff00] bg-[#a8ff00]/10 text-[#a8ff00] font-bold"
                          : "border-zinc-900 text-zinc-500 hover:border-zinc-700 hover:text-white"
                      }`}
                    >
                      <span>{day.toString().padStart(2, "0")}</span>
                      {isExpeditionActive && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#a8ff00] rounded-full animate-ping" />
                      )}
                      
                      {/* Hover Tooltip Overlay */}
                      {isExpeditionActive && (
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-zinc-950 text-white border border-zinc-800 p-2 text-[0.55rem] rounded-sm uppercase tracking-wider whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-xl">
                          📍 SIERRA MADRE ACTIVE DEPLOYMENT
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-900 flex items-center gap-3 text-[0.55rem] font-mono uppercase tracking-widest text-zinc-500">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-[#a8ff00] rounded-xs inline-block" /> Expedition Deployment Node</div>
              </div>
            </div>
          </div>
        </div>

        {/* --- REGISTRATION CONSOLE MODAL / OVERLAY LIGHTBOX --- */}
        <AnimatePresence>
          {selectedNode && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-zinc-950 border border-zinc-800 max-w-lg w-full p-8 rounded-sm text-left relative"
              >
                <button
                  onClick={() => setSelectedNode(null)}
                  className="absolute top-4 right-4 text-zinc-500 hover:text-white font-mono text-xs uppercase tracking-widest outline-none"
                >
                  [ Abort Esc ]
                </button>

                {registerSuccess ? (
                  <div className="py-8 text-center space-y-4">
                    <span className="text-3xl">📡</span>
                    <h4 className="text-xl font-black text-[#a8ff00] tracking-tighter uppercase">TRANSMISSION ROUTED</h4>
                    <p className="text-zinc-400 text-xs tracking-wide font-mono uppercase">
                      Your identity coordinates have been logged for {selectedNode.title}. Review your terminal dispatch email shortly for vetting instructions.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleRegistrationSubmit} className="space-y-6">
                    <div>
                      <span className="text-[0.6rem] font-mono text-[#a8ff00] uppercase tracking-[0.2em]">MANIFEST REGISTRATION TERMINAL</span>
                      <h4 className="text-2xl font-black tracking-tight uppercase text-white mt-1">
                        {selectedNode.title}
                      </h4>
                      <p className="text-zinc-500 text-xs font-mono mt-1 uppercase tracking-wider">
                        Target Location: {selectedNode.location} ({selectedNode.elevation})
                      </p>
                    </div>

                    <div className="text-xs text-zinc-400 font-mono border-y border-zinc-900 py-4 leading-relaxed uppercase">
                      {selectedNode.description}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[0.65rem] tracking-[0.2em] text-zinc-400 uppercase font-mono">
                        INPUT VERIFIED DISPATCH EMAIL:
                      </label>
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="your-signal-node@domain.com"
                        className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-[#a8ff00] px-4 py-3 text-sm text-white font-mono outline-none rounded-sm transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-white text-black font-mono font-bold text-xs py-4 uppercase tracking-[0.3em] hover:bg-[#a8ff00] transition-colors duration-300 rounded-sm"
                    >
                      SUBMIT ENCRYPTED REQ
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}