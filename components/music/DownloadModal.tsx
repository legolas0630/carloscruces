"use client";

import React from "react";
import { motion } from "framer-motion";

interface DownloadModalProps {
  downloadTrack: any;
  isEPDownload: boolean;
  isLifetimePass: boolean;
  supportAmount: string;
  isProcessing: boolean;
  setSupportAmount: (val: string) => void;
  onSupport: (method: 'stripe' | 'mercadopago') => void;
  onFreeDownload: () => void;
  onClose: () => void;
}

export default function DownloadModal({
  downloadTrack,
  isEPDownload,
  isLifetimePass,
  supportAmount,
  isProcessing,
  setSupportAmount,
  onSupport,
  onFreeDownload,
  onClose,
}: DownloadModalProps) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-[400px] bg-[#0f0f0f] border border-white/10 p-8 rounded-sm shadow-2xl text-center"
      >
        <div className="text-[0.6rem] tracking-[0.4em] text-[#444] mb-2 uppercase font-bold">
          {isLifetimePass ? "ULTIMATE ACCESS" : isEPDownload ? "COLLECTION DOWNLOAD" : "DIGITAL DOWNLOAD"}
        </div>
        <h2 className="text-2xl font-black tracking-tight mb-1" style={{ color: (isEPDownload || isLifetimePass) ? "#a8ff00" : downloadTrack?.color }}>
          {isLifetimePass ? "LIFETIME DISCOGRAPHY" : isEPDownload ? "FULL EP COLLECTION" : downloadTrack?.title}
        </h2>
        <p className="text-xs text-gray-500 mb-8 font-light tracking-widest">
          {isLifetimePass ? "INSTANT ACCESS TO ALL CURRENT & FUTURE RELEASES" : isEPDownload ? "ALL TRACKS INCLUDED" : `${downloadTrack?.genre} · ${downloadTrack?.bpm}`}
        </p>

        <div className="space-y-6">
          <div className="bg-white/5 p-6 rounded-sm border border-white/5">
            <div className="text-[0.7rem] tracking-widest text-gray-400 mb-4 uppercase">Pay what you want</div>
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-2xl font-bold text-white opacity-50">$</span>
              <input 
                type="number" 
                value={supportAmount}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || (parseFloat(val) >= 0 && !val.includes('-'))) {
                    setSupportAmount(val);
                  }
                }}
                placeholder="7.00"
                min="0"
                step="0.50"
                className="bg-transparent border-b border-white/20 text-2xl font-bold text-white focus:outline-none focus:border-[#a8ff00] w-24 text-center"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                disabled={isProcessing}
                className={`py-3 ${isProcessing ? 'bg-[#a8ff00]/50 cursor-wait' : 'bg-[#a8ff00]'} text-black font-black text-[0.6rem] tracking-[0.2em] rounded-sm hover:scale-[1.02] active:scale-[0.98] transition-all`}
                onClick={() => onSupport('stripe')}
              >
                {isProcessing ? '...' : 'STRIPE'}
              </button>
              <button 
                disabled={isProcessing}
                className={`py-3 ${isProcessing ? 'bg-[#009ee3]/50 cursor-wait' : 'bg-[#009ee3]'} text-white font-black text-[0.6rem] tracking-[0.2em] rounded-sm hover:scale-[1.02] active:scale-[0.98] transition-all`}
                onClick={() => onSupport('mercadopago')}
              >
                {isProcessing ? '...' : 'MERCADO PAGO'}
              </button>
            </div>
          </div>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-[0.6rem] uppercase tracking-[0.3em]"><span className="bg-[#0f0f0f] px-4 text-[#333]">or</span></div>
          </div>

          <button 
            onClick={onFreeDownload}
            className="text-[0.7rem] tracking-[0.3em] text-gray-500 hover:text-white transition-colors uppercase font-bold"
          >
            Download for free
          </button>
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-white transition-colors">
          ✕
        </button>
      </motion.div>
    </div>
  );
}