"use client";

import React from "react";

interface SettingsModuleProps {
  tfaActive: boolean;
  setTfaActive: (val: boolean) => void;
  telemetryActive: boolean;
  setTelemetryActive: (val: boolean) => void;
  onNotify: (msg: string) => void;
}

export default function SettingsModule({
  tfaActive,
  setTfaActive,
  telemetryActive,
  setTelemetryActive,
  onNotify,
}: SettingsModuleProps) {
  return (
    <div>
      <div className="border-b border-white/5 pb-4 mb-6 select-none">
        <h2 className="text-[0.75rem] font-black tracking-[0.25em] text-[#a8ff00] uppercase">
          // SECURITY TERMINAL CORE CONTROLS
        </h2>
      </div>
      <div className="space-y-4">
        
        <div 
          onClick={() => { setTfaActive(!tfaActive); onNotify(`2FA AUTHENTICATION ${!tfaActive ? "ENGAGED" : "DECOUPLING"}`); }}
          className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-white/5 rounded-sm cursor-pointer hover:border-white/10 transition-colors select-none"
        >
          <div>
            <div className="text-xs font-bold tracking-wider text-zinc-200 uppercase">2FA ACCESS RE-ENFORCEMENT</div>
            <div className="text-[0.62rem] text-zinc-500 mt-0.5 tracking-wide">REQUESTS SECURE SEED KEYS UPON CRITICAL RE-ROUTE DIRECTIVES</div>
          </div>
          <button className={`text-[0.6rem] px-3 py-1 border font-black tracking-widest rounded-sm uppercase transition-colors duration-150 ${
            tfaActive ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' : 'border-zinc-800 text-zinc-600 bg-zinc-950'
          }`}>
            {tfaActive ? "ACTIVE" : "OFF"}
          </button>
        </div>
        
        <div 
          onClick={() => { setTelemetryActive(!telemetryActive); onNotify(`METRICS STREAMING ${!telemetryActive ? "DEPLOYED" : "TERMINATED"}`); }}
          className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-white/5 rounded-sm cursor-pointer hover:border-white/10 transition-colors select-none"
        >
          <div>
            <div className="text-xs font-bold tracking-wider text-zinc-200 uppercase">AUDIO GRAPH TELEMETRY TELE-METERS</div>
            <div className="text-[0.62rem] text-zinc-500 mt-0.5 tracking-wide">STORES REALTIME METRIC PROGRESS FOR RETURNING VISITS RE-LOAD FILES</div>
          </div>
          <button className={`text-[0.6rem] px-3 py-1 border font-black tracking-widest rounded-sm uppercase transition-colors duration-150 ${
            telemetryActive ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' : 'border-zinc-800 text-zinc-600 bg-zinc-950'
          }`}>
            {telemetryActive ? "ENABLED" : "MUTED"}
          </button>
        </div>

      </div>
      
      <div className="mt-12 pt-4 border-t border-white/5 text-[0.6rem] text-zinc-600 leading-normal select-none">
        SYSTEM SECURITY LOG INSTANCE COMPLIANT WITH SYSTEM MATRIX CONTROLLERS v5<br />
        DATA COMPILATION CACHE STATE: STABLE MUTABLE LOCAL STATE HOOKS INJECTED
      </div>
    </div>
  );
}