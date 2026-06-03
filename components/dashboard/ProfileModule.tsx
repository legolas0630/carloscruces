"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

interface ProfileModuleProps {
  profileName: string;
  setProfileName: (name: string) => void;
  profileEmail: string;
  setProfileEmail?: (email: string) => void;
  nodeID: string;
  onNotify: () => void;
}

export default function ProfileModule({ 
  profileName, 
  setProfileName, 
  profileEmail, 
  nodeID, // 🟢 Destructured correctly here
  onNotify 
}: ProfileModuleProps) {
  const { t } = useLanguage();

  return (
    <div>
      <div className="border-b border-white/5 pb-4 mb-4 select-none">
        <h2 className="text-[0.75rem] font-black tracking-[0.25em] text-[#a8ff00] uppercase">
          {t("profile_title")}
        </h2>
      </div>

      <p className="text-zinc-400 text-xs mb-6 leading-relaxed select-none">
        {t("profile_desc")}
      </p>

      <div className="space-y-4">
        {/* READONLY NODE IDENTIFIER FIELD */}
        <div className="flex flex-col gap-1.5 select-none">
          <label className="text-[0.55rem] text-zinc-500 font-bold uppercase tracking-wider">
            CORE HARDWARE NODE ID
          </label>
          <div className="bg-zinc-950/40 border border-white/5 px-3 py-2.5 text-xs text-zinc-400 rounded-sm font-mono select-all">
            {nodeID}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 select-none">
          <label className="text-[0.55rem] text-zinc-500 font-bold uppercase tracking-wider">
            {t("profile_email_label") || "TERMINAL EMAIL ADDRESS"}
          </label>
          <div className="bg-zinc-950/80 border border-white/5 px-3 py-2.5 text-xs text-zinc-500 rounded-sm">
            {profileEmail}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[0.55rem] text-zinc-500 font-bold uppercase tracking-wider select-none">
            {t("profile_name_label") || "EDIT ALIAS"}
          </label>
          <input
            type="text"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            className="bg-[#111] border border-white/10 focus:border-[#a8ff00] px-3 py-2.5 text-xs text-white rounded-sm focus:outline-none transition-colors duration-200 font-mono"
          />
        </div>

        <button
          type="button"
          onClick={onNotify}
          className="w-full bg-[#a8ff00] hover:bg-[#baff3b] text-black font-black text-[0.65rem] tracking-[0.2em] py-3.5 px-4 rounded-sm transition-all duration-300 uppercase cursor-pointer mt-2"
        >
          {t("profile_save_btn")}
        </button>
      </div>
    </div>
  );
}