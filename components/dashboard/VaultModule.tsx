"use client";

import React, { useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext"; // Hook up your custom context layer

interface VaultFile {
  name: string;
  size: string;
  format: string;
  url?: string;
}

interface VaultModuleProps {
  vaultDownloads: VaultFile[];
  setVaultDownloads?: React.Dispatch<React.SetStateAction<VaultFile[]>>; // Optionalized signature type safety
  onNotify: (msg: string) => void;
}

export default function VaultModule({ vaultDownloads, onNotify }: VaultModuleProps) {
  const { t } = useLanguage();

  const handleDownload = (file: VaultFile) => {
    if (!file.url) {
      onNotify("ERROR: ASSET MODULE LINK UNVERIFIED");
      return;
    }
    onNotify(`INITIALISING DOWNLOAD: ${file.name}`);
    window.open(file.url, "_blank");
  };

  // Memoize ledger list processing loops to prevent unnecessary component redraws
  const renderedLedger = useMemo(() => {
    if (vaultDownloads.length === 0) {
      return (
        <div className="text-center py-12 border border-dashed border-white/5 bg-white/[0.01] rounded-sm select-none">
          <p className="text-xs text-zinc-500 tracking-wider uppercase font-bold">
            No secure assets deployed to this terminal node.
          </p>
        </div>
      );
    }

    return vaultDownloads.map((file, i) => {
      const isAvailable = !!file.url;
      
      return (
        <div 
          key={i} 
          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#0a0a0a] border border-white/5 hover:border-[#a8ff00]/20 transition-all rounded-sm gap-4 group"
        >
          <div className="flex-1 min-w-0 select-none">
            <h3 
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
              className="text-sm font-sans font-bold tracking-wide text-zinc-200 group-hover:text-white transition-colors truncate uppercase"
            >
              {file.name}
            </h3>
            <p className="text-[0.62rem] text-zinc-500 tracking-wider mt-1.5 uppercase font-medium">
              SIZE: <span className="text-zinc-400 font-mono mr-3">{file.size}</span> — FORMAT: <span className="text-zinc-400 font-mono">{file.format || "BINARY ARCHIVE"}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button 
              onClick={() => handleDownload(file)}
              disabled={!isAvailable}
              className={`text-[0.65rem] font-black tracking-widest px-5 py-2.5 rounded-sm transition-all shadow-md focus:outline-none uppercase ${
                isAvailable 
                  ? "bg-zinc-900 border border-white/10 text-zinc-300 hover:bg-[#a8ff00] hover:text-black hover:border-[#a8ff00] cursor-pointer" 
                  : "bg-zinc-950 border border-white/5 text-zinc-600 cursor-not-allowed"
              }`}
            >
              {isAvailable ? "DOWNLOAD" : "PENDING SYNC"}
            </button>
          </div>
        </div>
      );
    });
  }, [vaultDownloads, onNotify]);

  return (
    <div>
      {/* Module Title Header Block */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4 select-none">
        <h2 
          style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
          className="text-[0.75rem] font-black tracking-[0.25em] text-[#a8ff00] uppercase"
        >
          // THE VAULT (EXCLUSIVE DOWNLOADS)
        </h2>
        <span className="text-[0.55rem] text-zinc-500 tracking-widest uppercase font-bold">Vault Node 01</span>
      </div>

      <p className="text-zinc-400 text-xs mb-6 leading-relaxed select-none">
        Your clearance level grants uncompressed master file delivery logs, production wav bounces, raw metadata journals, and cinematic filmmaker visual lut preset collections.
      </p>

      {/* Secure Cryptographic Asset Ledger */}
      <div className="space-y-3">
        {renderedLedger}
      </div>
    </div>
  );
}