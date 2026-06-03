"use client";

import React, { useState, useMemo } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "@/context/LanguageContext"; // Import translation context

// Sub Module Connections
import VaultModule from "@/components/dashboard/VaultModule";
import HistoryModule from "@/components/dashboard/HistoryModule";
import MembershipModule from "@/components/dashboard/MembershipModule";
import ProfileModule from "@/components/dashboard/ProfileModule";
import SettingsModule from "@/components/dashboard/SettingsModule";

type TabID = "vault" | "history" | "membership" | "profile" | "settings";

interface DashboardClientProps {
  initialProfile: any;
  initialPurchases: any[];
  initialVaultDownloads: any[];
  initialExpeditions: any[];
}

export default function DashboardClient({
  initialProfile,
  initialPurchases,
  initialVaultDownloads,
  initialExpeditions,
}: DashboardClientProps) {
  const router = useRouter();
  const { t, locale } = useLanguage(); // Grab translator parser and active locale
  const [activeTab, setActiveTab] = useState<TabID>("vault");
  const [saveNotification, setSaveNotification] = useState("");

  // Instant Hydration of UI State Strings from Immutable Server Props
  const [profileName, setProfileName] = useState(initialProfile.name);
  const [nodeId] = useState(initialProfile.node_id);
  const [tier] = useState(initialProfile.tier);
  const [joinedDate] = useState(initialProfile.joined_date);

  // Hardware/Security User Preference Controls
  const [tfaActive, setTfaActive] = useState(true);
  const [telemetryActive, setTelemetryActive] = useState(true);

  // Hydrated System Data Collections
  const [vaultDownloads, setVaultDownloads] = useState(initialVaultDownloads);
  const [purchases, setPurchases] = useState(initialPurchases);
  const [expeditions, setExpeditions] = useState(initialExpeditions);

  const triggerSaveNotification = (msg: string) => {
    setSaveNotification(msg);
    setTimeout(() => setSaveNotification(""), 3000);
  };

  const handleUpdateProfile = async () => {
    if (!initialProfile.email) return;
    const { error } = await supabase
      .from("profiles")
      .update({ name: profileName.toUpperCase() })
      .eq("email", initialProfile.email);

    if (!error) triggerSaveNotification("USER ALIAS COMPUTED SUCCESSFULLY");
  };

  // Memoized sidebar layout tracking array — updates dynamically on language switches
  const navItems = useMemo(() => [
    { id: "vault" as TabID, label: t("dash_vault"), sub: "ACCESS ASSETS" },
    { id: "history" as TabID, label: t("dash_history"), sub: "ORDER LOGS" },
    { id: "membership" as TabID, label: t("dash_membership"), sub: "SUBSCRIPTION STATUS" },
    { id: "profile" as TabID, label: t("profile_title").replace("// ", ""), sub: "MUTATE ALIAS" },
    { id: "settings" as TabID, label: t("dash_settings"), sub: "TOGGLE HARDWARE" },
  ], [t, locale]);

  return (
    <div className="min-h-screen py-24 px-4 sm:px-10 max-w-[1200px] mx-auto font-mono text-[#f0f0f0]">
      
      {/* Realtime Status Alerts */}
      <AnimatePresence>
        {saveNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 bg-[#a8ff00] text-black font-black text-[0.65rem] tracking-[0.25em] px-6 py-3 rounded-sm z-[600] border border-white/20 uppercase shadow-2xl"
          >
            ✓ {saveNotification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Interface Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-white/5 pb-8 select-none">
        <div>
          <span className="text-[0.6rem] text-[#a8ff00] uppercase tracking-[0.3em] font-black block mb-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            CORE CONTROL TERMINAL // NODE ID: <span className="text-white tracking-widest">{nodeId}</span>
          </span>
          <h1 style={{ fontFamily: "var(--font-barlow-condensed), sans-serif" }} className="text-3xl sm:text-4xl font-black tracking-wider text-white uppercase leading-none">
            {t("dash_welcome")}, {profileName || "Explorer"}
          </h1>
          <p className="text-zinc-500 text-xs mt-2 tracking-wide">
            Access authorized via account terminal token <span className="text-zinc-400">{initialProfile.email}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="bg-white/[0.03] border border-white/10 text-white px-4 py-2 rounded-sm text-[0.65rem] font-black tracking-widest uppercase shadow-md">
            {t("dash_clearance")}: <span className="text-[#a8ff00] ml-1">{tier}</span>
          </span>
          
          <button onClick={() => signOut({ callbackUrl: "/logout/successful" })} className="border border-white/10 hover:border-red-500 hover:text-red-400 bg-white/[0.02] text-zinc-400 px-4 py-2 rounded-sm text-[0.65rem] font-bold tracking-wider uppercase transition-all duration-200 shadow-md">
            {t("dash_disconnect")}
          </button>
        </div>
      </div>

      {/* Structural Module Frame */}
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 mt-10 items-start">
        
        {/* Navigation Sidebar Selector */}
        <div className="flex flex-col gap-2 w-full bg-[#0a0a0a]/40 border border-white/5 p-4 rounded-sm backdrop-blur-md">
          <div className="text-[0.55rem] font-black tracking-[0.4em] text-zinc-600 uppercase px-3 mb-2 select-none">
            {t("dash_system_modules")}
          </div>
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id} onClick={() => setActiveTab(item.id)}
                className={`w-full text-left px-4 py-3 border rounded-sm transition-all duration-200 h-16 flex flex-col justify-center ${
                  active ? "bg-[#111] border-[#a8ff00]/40 text-[#a8ff00] shadow-sm" : "bg-transparent border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                <div className="text-[0.8rem] font-bold tracking-widest uppercase">{item.label}</div>
                <div className="text-[0.58rem] tracking-wider text-zinc-500 font-medium uppercase mt-0.5">{item.sub}</div>
              </button>
            );
          })}
        </div>

        {/* Component Display Viewport Box */}
        <div className="bg-[#090909]/60 border border-white/5 p-6 sm:p-8 rounded-sm backdrop-blur-md min-h-[460px]">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
              
              {activeTab === "vault" && (
                <VaultModule 
                  vaultDownloads={vaultDownloads} 
                  onNotify={triggerSaveNotification} 
                />
              )}
              
              {activeTab === "history" && (
                <HistoryModule 
                  purchases={purchases} 
                />
              )}
              
              {activeTab === "membership" && (
                <MembershipModule 
                  tier={tier} 
                  setTier={() => router.push("/music")} 
                  joinedDate={joinedDate} 
                  setJoinedDate={() => {}} 
                  expeditions={expeditions} 
                  setExpeditions={setExpeditions} 
                  onNotify={triggerSaveNotification} 
                />
              )}
              
              {activeTab === "profile" && (
                <ProfileModule 
                  profileName={profileName} 
                  setProfileName={setProfileName} 
                  profileEmail={initialProfile.email} 
                  setProfileEmail={() => {}} 
                  nodeId={nodeId} 
                  onNotify={handleUpdateProfile} 
                />
              )}
              
              {activeTab === "settings" && (
                <SettingsModule 
                  tfaActive={tfaActive} 
                  setTfaActive={setTfaActive} 
                  telemetryActive={telemetryActive} 
                  setTelemetryActive={setTelemetryActive} 
                  onNotify={triggerSaveNotification} 
                />
              )}
              
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}