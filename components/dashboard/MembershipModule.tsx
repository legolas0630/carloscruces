"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

interface MembershipModuleProps {
  tier: string;
  setTier: () => void;
  joinedDate: string;
  setJoinedDate?: () => void;
  expeditions: any[];
  setExpeditions?: React.Dispatch<React.SetStateAction<any[]>>;
  onNotify: (msg: string) => void;
}

export default function MembershipModule({ tier, setTier, joinedDate, expeditions }: MembershipModuleProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <div>
        <div className="border-b border-white/5 pb-4 mb-4 select-none">
          <h2 className="text-[0.75rem] font-black tracking-[0.25em] text-[#a8ff00] uppercase">
            {t("member_title")}
          </h2>
        </div>
        <p className="text-zinc-400 text-xs mb-6 select-none">{t("member_desc")}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-white/[0.01] border border-white/5 rounded-sm select-none">
            <div className="text-[0.55rem] text-zinc-500 tracking-widest font-bold uppercase mb-1">{t("member_tier_label")}</div>
            <div className="text-sm font-bold text-white tracking-wide uppercase">{tier}</div>
          </div>
          <div className="p-4 bg-white/[0.01] border border-white/5 rounded-sm select-none">
            <div className="text-[0.55rem] text-zinc-500 tracking-widest font-bold uppercase mb-1">{t("member_joined_label")}</div>
            <div className="text-sm font-mono font-bold text-[#a8ff00] tracking-wide">{joinedDate}</div>
          </div>
        </div>

        <button 
          onClick={setTier}
          className="mt-4 w-full bg-white/5 hover:bg-[#a8ff00] text-white hover:text-black font-black text-[0.65rem] tracking-widest py-3 border border-white/10 hover:border-[#a8ff00] rounded-sm transition-all uppercase"
        >
          {t("member_upgrade_btn")}
        </button>
      </div>

      {/* Flight Logistics Segment */}
      <div>
        <div className="border-b border-white/5 pb-3 mb-4 select-none">
          <h3 className="text-[0.65rem] font-black tracking-[0.2em] text-zinc-400 uppercase">
            {t("member_exp_title")}
          </h3>
        </div>

        {expeditions.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-white/5 bg-white/[0.01] rounded-sm select-none">
            <p className="text-xs text-zinc-500 tracking-wider uppercase font-medium">
              {t("member_exp_empty")}
            </p>
          </div>
        ) : (
          <div className="space-y-2 select-none">
            {expeditions.map((exp, idx) => (
              <div key={idx} className="p-3 bg-[#0a0a0a] border border-white/5 rounded-sm flex justify-between text-xs font-mono text-zinc-400">
                <span className="font-bold text-zinc-300 uppercase">{exp.location || "ZONE UNKNOWN"}</span>
                <span className="text-zinc-500 font-medium">{exp.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}