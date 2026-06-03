"use client";

import React from "react";

interface ProfileModuleProps {
  profileName: string;
  setProfileName: (val: string) => void;
  profileEmail: string;
  setProfileEmail: (val: string) => void;
  nodeId: string;
  onNotify: (msg: string) => void;
}

export default function ProfileModule({
  profileName,
  setProfileName,
  profileEmail,
  setProfileEmail,
  nodeId,
  onNotify,
}: ProfileModuleProps) {
  return (
    <div>
      <div className="border-b border-white/5 pb-4 mb-6 select-none">
        <h2 className="text-[0.75rem] font-black tracking-[0.25em] text-[#a8ff00] uppercase">
          // IDENTIFICATION SETTINGS CONFIGURATORS
        </h2>
      </div>
      <form 
        onSubmit={(e) => { e.preventDefault(); onNotify("USER SYSTEM ATTRIBUTES COMPUTED"); }} 
        className="space-y-5 max-w-xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-b border-white/5 pb-4 items-center">
          <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Display Alias</span>
          <input 
            type="text"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value.toUpperCase())}
            className="sm:col-span-2 bg-[#111] border border-white/5 focus:border-[#a8ff00] rounded-sm px-4 py-2.5 text-sm font-sans font-bold tracking-wide text-white focus:outline-none uppercase"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-b border-white/5 pb-4 items-center">
          <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Routing Email</span>
          <input 
            type="email"
            value={profileEmail}
            onChange={(e) => setProfileEmail(e.target.value)}
            className="sm:col-span-2 bg-[#111] border border-white/5 focus:border-[#a8ff00] rounded-sm px-4 py-2.5 text-sm font-mono tracking-wide text-zinc-300 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pb-2 items-center">
          <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Hardware Signature</span>
          <span className="sm:col-span-2 text-zinc-500 font-mono text-xs tracking-widest uppercase pl-4 select-none">{nodeId} (PROTECTED)</span>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-[#a8ff00] text-black font-black text-xs tracking-widest rounded-sm uppercase hover:bg-[#baff3b] transition-all"
        >
          SAVE PROFILE MATRIX
        </button>
      </form>
    </div>
  );
}