"use client";

import React from "react";

interface ExpeditionItem {
  id: number;
  location: string;
  date: string;
  status: string;
}

interface MembershipModuleProps {
  tier: string;
  setTier: (val: string) => void;
  joinedDate: string;
  setJoinedDate: (val: string) => void;
  expeditions: ExpeditionItem[];
  setExpeditions: React.Dispatch<React.SetStateAction<ExpeditionItem[]>>;
  onNotify: (msg: string) => void;
}

export default function MembershipModule({
  tier,
  setTier,
  joinedDate,
  setJoinedDate,
  expeditions,
  setExpeditions,
  onNotify,
}: MembershipModuleProps) {
  return (
    <div>
      <div className="border-b border-white/5 pb-4 mb-6 select-none">
        <h2 className="text-[0.75rem] font-black tracking-[0.25em] text-[#a8ff00] uppercase">
          // CONFIGURABLE SYSTEM ACCOUNT TIERS
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 bg-[#0a0a0a] border border-white/5 rounded-sm">
          <label className="text-[0.58rem] tracking-[0.25em] text-zinc-500 font-bold uppercase mb-1 block">Account Level Registry</label>
          <select 
            value={tier}
            onChange={(e) => { setTier(e.target.value); onNotify("LEVEL VALUE ADJUSTED"); }}
            className="bg-transparent text-xl font-bold text-white tracking-wide outline-none cursor-pointer border-b border-white/5 focus:border-[#a8ff00] mt-1 uppercase w-full py-1"
          >
            <option value="STANDARD ACCESS" className="bg-[#0f0f0f]">STANDARD ACCESS</option>
            <option value="PRO PRODUCER" className="bg-[#0f0f0f]">PRO PRODUCER</option>
            <option value="ASCENDANT (VIP)" className="bg-[#0f0f0f]">ASCENDANT (VIP)</option>
          </select>
        </div>
        <div className="p-5 bg-[#0a0a0a] border border-white/5 rounded-sm">
          <label className="text-[0.58rem] tracking-[0.25em] text-zinc-500 font-bold uppercase mb-1 block">Ingress Matrix Timestamp</label>
          <input 
            type="text" 
            value={joinedDate}
            onChange={(e) => setJoinedDate(e.target.value.toUpperCase())}
            className="bg-transparent text-xl font-bold text-white tracking-wide border-b border-transparent focus:border-zinc-700 outline-none mt-1 w-full uppercase py-1"
          />
        </div>
      </div>
      
      <div className="mt-8">
        <div className="text-[0.62rem] tracking-[0.3em] text-zinc-400 font-black uppercase mb-4">// EDIT EXCURSION SLOTS</div>
        <div className="space-y-3">
          {expeditions.map((exp, idx) => (
            <div key={exp.id} className="p-4 bg-[#0a0a0a] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between rounded-sm gap-4">
              <div className="flex-1 w-full">
                <input 
                  type="text" 
                  value={exp.location}
                  onChange={(e) => {
                    const updated = [...expeditions];
                    updated[idx].location = e.target.value;
                    setExpeditions(updated);
                  }}
                  className="bg-transparent border-b border-transparent focus:border-zinc-700 outline-none text-sm font-sans font-bold tracking-wide text-zinc-200 focus:text-white w-full"
                />
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[0.55rem] text-zinc-600 font-mono">TIMEFRAME:</span>
                  <input 
                    type="text" 
                    value={exp.date}
                    onChange={(e) => {
                      const updated = [...expeditions];
                      updated[idx].date = e.target.value.toUpperCase();
                      setExpeditions(updated);
                    }}
                    className="bg-transparent border-b border-transparent focus:border-zinc-700 outline-none text-[0.6rem] font-mono text-zinc-500 w-24 uppercase"
                  />
                </div>
              </div>
              <select
                value={exp.status}
                onChange={(e) => {
                  const updated = [...expeditions];
                  updated[idx].status = e.target.value;
                  setExpeditions(updated);
                  onNotify("CLEARANCE STATE MODIFIED");
                }}
                className={`px-2 py-1 rounded-sm text-[0.55rem] font-black tracking-widest bg-black border outline-none cursor-pointer ${
                  exp.status === "CONFIRMED" ? "border-emerald-500/30 text-emerald-400" : "border-amber-500/30 text-amber-400"
                }`}
              >
                <option value="CONFIRMED" className="text-emerald-400">CONFIRMED</option>
                <option value="PENDING" className="text-amber-400">PENDING</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}