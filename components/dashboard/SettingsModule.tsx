"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

interface SettingsModuleProps {
  tfaActive: boolean;
  setTfaActive: (active: boolean) => void;
  telemetryActive: boolean;
  setTelemetryActive: (active: boolean) => void;
  onNotify: (msg: string) => void;
}

export default function SettingsModule({
  tfaActive,
  setTfaActive,
  telemetryActive,
  setTelemetryActive,
  onNotify,
}: SettingsModuleProps) {
  const { t } = useLanguage();

  return (
    <div>
      <div className="border-b border-white/5 pb-4 mb-4 select-none">
        <h2 className="text-[0.75rem] font-black tracking-[0.25em] text-[#a8ff00] uppercase">
          {t("settings_title")}
        </h2>
      </div>

      <p className="text-zinc-400 text-xs mb-6 leading-relaxed select-none">
        {t("settings_desc")}
      </p>

      <div className="space-y-4">
        {/* Toggle Flag Module 01 */}
        <div className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/5 rounded-sm select-none gap-4">
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white tracking-wider uppercase mb-0.5">{t("settings_tfa_label")}</h4>
            <p className="text-[0.58rem] text-zinc-500 tracking-wide font-medium uppercase leading-normal">{t("settings_tfa_sub")}</p>
          </div>
          <button 
            onClick={() => {
              setTfaActive(!tfaActive);
              onNotify("SECURITY PARAMETERS OVERWRITTEN");
            }}
            className={`text-[0.6rem] font-black tracking-widest border px-3.5 py-1.5 rounded-sm transition-all focus:outline-none min-w-[85px] text-center ${
              tfaActive 
                ? "bg-[#a8ff00]/5 border-[#a8ff00]/30 text-[#a8ff00]" 
                : "bg-transparent border-white/10 text-zinc-500 hover:text-white"
            }`}
          >
            {tfaActive ? t("settings_active") : t("settings_disabled")}
          </button>
        </div>

        {/* Toggle Flag Module 02 */}
        <div className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/5 rounded-sm select-none gap-4">
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white tracking-wider uppercase mb-0.5">{t("settings_telemetry_label")}</h4>
            <p className="text-[0.58rem] text-zinc-500 tracking-wide font-medium uppercase leading-normal">{t("settings_telemetry_sub")}</p>
          </div>
          <button 
            onClick={() => {
              setTelemetryActive(!telemetryActive);
              onNotify("DIAGNOSTIC PIPELINE STATUS UPDATED");
            }}
            className={`text-[0.6rem] font-black tracking-widest border px-3.5 py-1.5 rounded-sm transition-all focus:outline-none min-w-[85px] text-center ${
              telemetryActive 
                ? "bg-[#a8ff00]/5 border-[#a8ff00]/30 text-[#a8ff00]" 
                : "bg-transparent border-white/10 text-zinc-500 hover:text-white"
            }`}
          >
            {telemetryActive ? t("settings_active") : t("settings_disabled")}
          </button>
        </div>
      </div>
    </div>
  );
}