"use client";

import React, { useState } from "react";

interface PurchaseItem {
  id: string;
  item: string;
  price: string;
  date: string;
  status: string;
}

interface HistoryModuleProps {
  purchases: PurchaseItem[];
  setPurchases: React.Dispatch<React.SetStateAction<PurchaseItem[]>>;
  onNotify: (msg: string) => void;
}

export default function HistoryModule({ purchases, setPurchases, onNotify }: HistoryModuleProps) {
  const [newPurchase, setNewPurchase] = useState({ item: "", price: "", status: "FULFILLED" });

  return (
    <div>
      <div className="border-b border-white/5 pb-4 mb-4 select-none">
        <h2 className="text-[0.75rem] font-black tracking-[0.25em] text-[#a8ff00] uppercase">
          // TRANSACTION REGISTRY DATABASE
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-sm mb-6 items-end">
        <div className="flex flex-col gap-1">
          <span className="text-[0.55rem] text-zinc-500 font-bold uppercase">Item Header Label</span>
          <input 
            type="text" 
            placeholder="RITUAL HOODIE (L)"
            value={newPurchase.item}
            onChange={(e) => setNewPurchase({ ...newPurchase, item: e.target.value.toUpperCase() })}
            className="bg-[#111] border border-white/5 px-3 py-2 text-xs text-white rounded-sm outline-none focus:border-[#a8ff00] uppercase"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[0.55rem] text-zinc-500 font-bold uppercase">Price Amount</span>
          <input 
            type="text" 
            placeholder="€75.00"
            value={newPurchase.price}
            onChange={(e) => setNewPurchase({ ...newPurchase, price: e.target.value })}
            className="bg-[#111] border border-white/5 px-3 py-2 text-xs text-white rounded-sm outline-none focus:border-[#a8ff00]"
          />
        </div>
        <button 
          onClick={() => {
            if (!newPurchase.item || !newPurchase.price) return;
            const randID = `TX-${Math.floor(1000 + Math.random() * 9000)}`;
            const today = new Date().toLocaleDateString("en-GB");
            setPurchases([...purchases, { ...newPurchase, id: randID, date: today }]);
            setNewPurchase({ item: "", price: "", status: "FULFILLED" });
            onNotify("LEDGER DISPATCH BLOCK COMMITTED");
          }}
          className="bg-white/5 hover:bg-[#a8ff00] text-white hover:text-black font-black text-[0.6rem] tracking-widest h-9 border border-white/10 hover:border-[#a8ff00] rounded-sm transition-all"
        >
          COMMIT LOG BLOCK
        </button>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-xs text-zinc-400 min-w-[550px]">
          <thead>
            <tr className="border-b border-white/5 text-zinc-500 text-[0.6rem] tracking-[0.2em] uppercase select-none">
              <th className="pb-3 font-bold">Ref Token</th>
              <th className="pb-3 font-bold">Item Description String</th>
              <th className="pb-3 font-bold">Cost</th>
              <th className="pb-3 font-bold">Date</th>
              <th className="pb-3 font-bold text-right">Delete Node</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {purchases.map((p, idx) => (
              <tr key={p.id} className="hover:bg-white/[0.01] transition-colors">
                <td className="py-4 text-zinc-500 font-mono tracking-wider">{p.id}</td>
                <td className="py-4">
                  <input 
                    type="text" 
                    value={p.item}
                    onChange={(e) => {
                      const updated = [...purchases];
                      updated[idx].item = e.target.value.toUpperCase();
                      setPurchases(updated);
                    }}
                    className="bg-transparent border-b border-transparent focus:border-zinc-700 outline-none font-sans font-bold tracking-wide text-zinc-200 focus:text-white uppercase w-full max-w-xs"
                  />
                </td>
                <td className="py-4">
                  <input 
                    type="text" 
                    value={p.price}
                    onChange={(e) => {
                      const updated = [...purchases];
                      updated[idx].price = e.target.value;
                      setPurchases(updated);
                    }}
                    className="bg-transparent border-b border-transparent focus:border-zinc-700 outline-none font-mono text-zinc-300 w-16"
                  />
                </td>
                <td className="py-4 font-mono text-zinc-500">{p.date}</td>
                <td className="py-4 text-right">
                  <button 
                    onClick={() => {
                      setPurchases(purchases.filter(item => item.id !== p.id));
                      onNotify("LEDGER ENTRY DELETED");
                    }}
                    className="text-red-500 hover:text-red-400 bg-transparent border-none text-xs px-2 py-1 font-bold"
                  >
                    DELETE
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}