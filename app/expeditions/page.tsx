"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "@/components/SectionHeader";
import { useLanguage } from "@/context/LanguageContext";

interface ExpeditionNode {
  id: string;
  titleKey: string;
  location: string;
  elevation: string;
  dateDisplay: string;
  spotsTotal: number;
  spotsRegistered: number;
  status: "active" | "full" | "concluded";
  coordinates: string;
  descKey: string;
}

export default function ExpeditionsPage() {
  const { t } = useLanguage();
  const [selectedNode, setSelectedNode] = useState<ExpeditionNode | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>((""),);

  const upcomingNodes: ExpeditionNode[] = useMemo(() => [
    {
      id: "node-01",
      titleKey: "exp_node_1_title",
      location: "Guanajuato Highlands, MX",
      elevation: "2,800m",
      dateDisplay: "JULY 15 - 18, 2026",
      spotsTotal: 8,
      spotsRegistered: 5,
      status: "active",
      coordinates: "21.0181° N, 101.2574° W",
      descKey: "exp_node_1_desc",
    },
    {
      id: "node-02",
      titleKey: "exp_node_2_title",
      location: "Mineral de Pozos, MX",
      elevation: "2,300m",
      dateDisplay: "AUG 22 - 24, 2026",
      spotsTotal: 6,
      spotsRegistered: 6,
      status: "full",
      coordinates: "21.2212° N, 100.4892° W",
      descKey: "exp_node_2_desc",
    },
    {
      id: "node-03",
      titleKey: "exp_node_3_title",
      location: "Nevado de Toluca, MX",
      elevation: "4,680m",
      dateDisplay: "OCT 05 - 09, 2026",
      spotsTotal: 5,
      spotsRegistered: 1,
      status: "active",
      coordinates: "19.1025° N, 99.7611° W",
      descKey: "exp_node_3_desc",
    },
  ], []);

  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const startOffsetBlankDays = Array.from({ length: 3 });

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    
    setRegisterSuccess(true);
    setTimeout(() => {
      setRegisterSuccess(false);
      setEmailInput("");
      setSelectedNode(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-24 relative overflow-hidden select-none">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-[#a8ff00]/5 to-transparent pointer-events-none blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-16">
        
        {/* --- HEADER --- */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-left border-b border-zinc-900 pb-12"
        >
          <SectionHeader label="EXPEDITIONS" sub={t("exp_header_sub")} />
          
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-7">
              <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-white uppercase leading-none">
                {t("exp_hero_title")}
              </h2>
            </div>
            <div className="lg:col-span-5 border-l-2 border-[#a8ff00] pl-6 py-2">
              <p className="text-zinc-400 text-xs tracking-wider uppercase leading-relaxed font-sans">
                {t("exp_hero_desc")}
              </p>
            </div>
          </div>
        </motion.div>

        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT INDEX */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-zinc-500 font-mono text-[0.65rem] uppercase tracking-[0.3em] mb-4 flex items-center gap-2 font-bold">
              <span>●</span> {t("exp_manifest_title")}
            </h3>
            
            {upcomingNodes.map((node, index) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`border text-left p-6 rounded-sm backdrop-blur-md transition-all duration-300 ${
                  node.status === "full" 
                    ? "border-zinc-900 bg-zinc-950/20 opacity-40" 
                    : "border-zinc-800 bg-zinc-950/40 hover:border-[#a8ff00]/40"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 text-[0.6rem] font-mono text-zinc-500 uppercase tracking-widest mb-1 font-bold">
                      <span>{node.dateDisplay}</span>
                      <span>•</span>
                      <span className="text-[#a8ff00] font-black">{node.elevation}</span>
                    </div>
                    <h4 className="text-xl font-bold uppercase tracking-wide text-white mb-2 font-barlow-condensed">
                      {t(node.titleKey)}
                    </h4>
                    <p className="text-zinc-400 text-xs tracking-wide leading-relaxed font-sans">
                      {t(node.descKey)}
                    </p>
                    <div className="text-[0.6rem] font-mono text-zinc-600 mt-3 uppercase tracking-wider font-bold">
                      📍 {node.coordinates} - {node.location}
                    </div>
                  </div>

                  <div className="sm:text-right flex sm:flex-col justify-between items-center sm:items-end gap-3 border-t border-zinc-900 sm:border-0 pt-3 sm:pt-0 min-w-[160px]">
                    <span className="text-[0.6rem] font-mono uppercase tracking-wider text-zinc-500 font-bold">
                      {node.status === "full" ? (
                        t("exp_btn_full")
                      ) : (
                        <><span className="text-white font-black">{node.spotsTotal - node.spotsRegistered}</span> AVAILABLE</>
                      )}
                    </span>
                    
                    {node.status === "full" ? (
                      <span className="border border-zinc-900 text-zinc-700 px-4 py-2 text-[0.6rem] font-bold tracking-widest uppercase rounded-sm bg-zinc-950/60">
                        {t("exp_btn_full")}
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedNode(node)}
                        className="bg-[#a8ff00] text-black hover:bg-white px-5 py-2.5 text-[0.6rem] font-black tracking-widest uppercase transition-colors duration-200 rounded-sm cursor-pointer shadow-sm"
                      >
                        {t("exp_btn_request")}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* RIGHT CALENDAR */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-zinc-500 font-mono text-[0.65rem] uppercase tracking-[0.3em] mb-4 flex items-center gap-2 font-bold">
              <span>●</span> {t("exp_calendar_title")}
            </h3>

            <div className="border border-zinc-800 bg-zinc-950/20 p-6 rounded-sm backdrop-blur-md">
              <div className="flex justify-between items-center mb-6 border-b border-zinc-900 pb-3">
                <span className="font-mono text-xs text-[#a8ff00] tracking-[0.2em] uppercase font-black">JULY // 2026</span>
                <span className="text-[0.55rem] font-mono text-zinc-600 uppercase tracking-widest font-bold">{t("exp_calendar_sync")}</span>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-[0.55rem] font-mono text-zinc-500 uppercase tracking-wider mb-2 font-bold">
                <span>{t("exp_cal_sun")}</span>
                <span>{t("exp_cal_mon")}</span>
                <span>{t("exp_cal_tue")}</span>
                <span>{t("exp_cal_wed")}</span>
                <span>{t("exp_cal_thu")}</span>
                <span>{t("exp_cal_fri")}</span>
                <span>{t("exp_cal_sat")}</span>
              </div>

              <div className="grid grid-cols-7 gap-1.5 text-xs font-mono">
                {startOffsetBlankDays.map((_, i) => (
                  <div key={`blank-${i}`} className="p-2 border border-transparent text-transparent select-none">00</div>
                ))}
                
                {calendarDays.map((day) => {
                  const isExpeditionActive = day >= 15 && day <= 18;
                  return (
                    <div
                      key={`day-${day}`}
                      className={`p-2 border text-center relative transition-all duration-200 group rounded-xs ${
                        isExpeditionActive
                          ? "border-[#a8ff00] bg-[#a8ff00]/5 text-[#a8ff00] font-black"
                          : "border-zinc-900 text-zinc-600 hover:border-zinc-800 hover:text-white"
                      }`}
                    >
                      <span>{day.toString().padStart(2, "0")}</span>
                      {isExpeditionActive && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#a8ff00] rounded-full animate-ping" />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-900 flex items-center gap-3 text-[0.55rem] font-mono uppercase tracking-widest text-zinc-600 font-bold">
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-[#a8ff00] rounded-xs inline-block" /> {t("exp_calendar_footer")}</div>
              </div>
            </div>
          </div>
        </div>

        {/* --- REGISTRATION MODAL --- */}
        <AnimatePresence>
          {selectedNode && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                className="bg-zinc-950 border border-zinc-800 max-w-lg w-full p-8 rounded-sm text-left relative shadow-2xl"
              >
                <button
                  onClick={() => setSelectedNode(null)}
                  className="absolute top-4 right-4 text-zinc-600 hover:text-white font-mono text-[0.6rem] uppercase tracking-widest outline-none font-bold cursor-pointer transition-colors"
                >
                  {t("exp_modal_abort")}
                </button>

                {registerSuccess ? (
                  <div className="py-8 text-center space-y-4">
                    <span className="text-3xl animate-pulse inline-block">✨</span>
                    <h4 className="text-2xl font-black text-[#a8ff00] tracking-tight uppercase">{t("exp_modal_success_title")}</h4>
                    <p className="text-zinc-400 text-xs tracking-wide font-sans leading-relaxed">
                      {t("exp_modal_success_desc")}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleRegistrationSubmit} className="space-y-6">
                    <div>
                      <span className="text-[0.55rem] font-mono text-[#a8ff00] uppercase tracking-[0.25em] font-bold">{t("exp_modal_label")}</span>
                      <h4 className="text-2xl font-black tracking-tight uppercase text-white mt-1 font-barlow-condensed">
                        {t(selectedNode.titleKey)}
                      </h4>
                      <p className="text-zinc-500 text-xs font-mono mt-1 uppercase tracking-wider font-bold">
                        {selectedNode.location} — {selectedNode.elevation}
                      </p>
                    </div>

                    <div className="text-xs text-zinc-400 font-sans border-y border-zinc-900 py-4 leading-relaxed">
                      {t(selectedNode.descKey)}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[0.6rem] tracking-[0.2em] text-zinc-500 uppercase font-mono font-bold">
                        {t("exp_input_label")}
                      </label>
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="one-love@vibrations.com"
                        className="w-full bg-zinc-900/40 border border-zinc-800 focus:border-[#a8ff00] px-4 py-3.5 text-xs text-white font-mono outline-none rounded-sm transition-colors uppercase tracking-widest placeholder-zinc-700 font-bold"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-white text-black font-mono font-black text-xs py-4 uppercase tracking-[0.25em] hover:bg-[#a8ff00] transition-colors duration-300 rounded-sm cursor-pointer shadow-md"
                    >
                      {t("exp_btn_submit")}
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