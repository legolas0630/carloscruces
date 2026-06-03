"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

interface PurchaseItem {
  id: string;
  item: string;
  price: string;
  date: string;
  status: string;
}

interface HistoryModuleProps {
  purchases: PurchaseItem[];
  setPurchases?: React.Dispatch<React.SetStateAction<PurchaseItem[]>>;
  onNotify?: (msg: string) => void;
}

export default function HistoryModule({ purchases }: HistoryModuleProps) {
  const { t } = useLanguage();

  return (
    <div>
      <div className="border-b border-white/5 pb-4 mb-4 select-none">
        <h2 className="text-[0.75rem] font-black tracking-[0.25em] text-[#a8ff00] uppercase">
          {t("history_title")}
        </h2>
      </div>

      <p className="text-zinc-400 text-xs mb-6 leading-relaxed select-none">
        {t("history_desc")}
      </p>

      <div className="overflow-x-auto w-full">
        {purchases.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-white/5 bg-white/[0.01] rounded-sm select-none">
            <p className="text-xs text-zinc-500 tracking-wider uppercase font-bold">
              {t("history_empty")}
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-xs text-zinc-400 min-w-[550px]">
            <thead>
              <tr className="border-b border-white/5 text-zinc-500 text-[0.6rem] tracking-[0.2em] uppercase select-none">
                <th className="pb-3 font-bold">{t("history_ref")}</th>
                <th className="pb-3 font-bold">{t("history_desc_str")}</th>
                <th className="pb-3 font-bold">{t("history_cost")}</th>
                <th className="pb-3 font-bold">{t("history_date")}</th>
                <th className="pb-3 font-bold text-right">{t("history_status")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 select-none">
              {purchases.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="py-4 text-zinc-500 font-mono tracking-wider font-medium">{p.id}</td>
                  <td className="py-4">
                    <span className="font-sans font-bold tracking-wide text-zinc-200 group-hover:text-white transition-colors uppercase text-sm">
                      {p.item}
                    </span>
                  </td>
                  <td className="py-4 text-zinc-300 font-mono font-medium tracking-wide">{p.price}</td>
                  <td className="py-4 font-mono text-zinc-500 tracking-wide">{p.date}</td>
                  <td className="py-4 text-right">
                    <span className={`inline-block px-2.5 py-0.5 border rounded-sm text-[0.55rem] font-black tracking-widest uppercase ${
                      p.status?.toUpperCase() === "FULFILLED" || p.status?.toUpperCase() === "COMPLETADO"
                        ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/5"
                        : "border-amber-500/20 text-amber-400 bg-amber-500/5"
                    }`}>
                      {p.status?.toUpperCase() === "FULFILLED" ? t("history_fulfilled") : p.status || t("history_pending")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}