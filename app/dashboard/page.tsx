"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

// Sub Module Connections
import VaultModule from "@/components/dashboard/VaultModule";
import HistoryModule from "@/components/dashboard/HistoryModule";
import MembershipModule from "@/components/dashboard/MembershipModule";
import ProfileModule from "@/components/dashboard/ProfileModule";
import SettingsModule from "@/components/dashboard/SettingsModule";

type TabID = "vault" | "history" | "membership" | "profile" | "settings";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabID>("vault");

  // Secure System Core States (Read-Only from Supabase)
  const [nodeId, setNodeId] = useState("CC-SYNCING-X");
  const [tier, setTier] = useState("STANDARD ACCESS");
  const [joinedDate, setJoinedDate] = useState("");
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  
  // Mutable User Profile Settings Toggles
  const [tfaActive, setTfaActive] = useState(true);
  const [telemetryActive, setTelemetryActive] = useState(true);
  const [saveNotification, setSaveNotification] = useState("");
  const [isDataSyncing, setIsDataSyncing] = useState(true);

  // Clean Production Database Catalogs (Placeholders Fully Removed)
  const [vaultDownloads, setVaultDownloads] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [expeditions, setExpeditions] = useState<any[]>([]);

  const triggerSaveNotification = (msg: string) => {
    setSaveNotification(msg);
    setTimeout(() => setSaveNotification(""), 3000);
  };

  // ================= SECURE REMOTE DATABASE TELEMETRY SYNC =================
  const syncTelemetryMetrics = useCallback(async (email: string, name: string) => {
    try {
      setIsDataSyncing(true);

      // 1. Fetch or automatically provision user profile matrix parameters
      let { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .single();

      if (profileError && profileError.code === "PGRST116") {
        const fallbackNodeId = `CC-${Math.floor(1000 + Math.random() * 9000)}-X`;
        const dateOptions = { month: "long", year: "numeric" } as const;
        const currentStamp = new Date().toLocaleDateString("en-US", dateOptions).toUpperCase();

        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert([
            { email, name: name.toUpperCase(), tier: "STANDARD ACCESS", node_id: fallbackNodeId, joined_date: currentStamp }
          ])
          .select()
          .single();

        if (createError) throw createError;
        profile = newProfile;
      }

      if (profile) {
        setProfileName(profile.name);
        setProfileEmail(profile.email);
        setTier(profile.tier);
        setNodeId(profile.node_id);
        setJoinedDate(profile.joined_date);
      }

      // 2. Fetch authenticated user transactional receipt logs
      const { data: orderLogs } = await supabase
        .from("purchases")
        .select("*")
        .eq("user_email", email)
        .order("date", { ascending: false });
        
      if (orderLogs) setPurchases(orderLogs);

      // 3. Fetch premium media asset files unlocked for this account level
      const { data: vaultFiles } = await supabase
        .from("vault_downloads")
        .select("*");
        
      if (vaultFiles) setVaultDownloads(vaultFiles);

      // 4. Fetch private booked expedition itineraries
      const { data: missionLogs } = await supabase
        .from("expeditions")
        .select("*")
        .eq("user_email", email);
        
      if (missionLogs) setExpeditions(missionLogs);

    } catch (err) {
      console.error("Supabase engine telemetry link failure:", err);
    } finally {
      setIsDataSyncing(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      syncTelemetryMetrics(session.user.email, session.user.name || "EXPLORER");
    }
  }, [session, status, syncTelemetryMetrics]);

  // Secure User Data Mutator Actions (Only updates profile records, no tier bypassing)
  const handleUpdateProfile = async () => {
    if (!profileEmail) return;
    const { error } = await supabase
      .from("profiles")
      .update({ name: profileName })
      .eq("email", profileEmail);

    if (!error) triggerSaveNotification("USER ALIAS COMPUTED SUCCESSFULLY");
  };

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (status === "loading" || isDataSyncing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="text-[0.7rem] font-mono tracking-[0.4em] text-[#a8ff00] animate-pulse">
          SECURE DISPATCH NODE INITIALISING...
        </div>
      </div>
    );
  }

  const navItems = [
    { id: "vault" as TabID, label: "THE VAULT", sub: "ACCESS ASSETS" },
    { id: "history" as TabID, label: "PURCHASE HISTORY", sub: "ORDER LOGS" },
    { id: "membership" as TabID, label: "MEMBERSHIP", sub: "SUBSCRIPTION STATUS" },
    { id: "profile" as TabID, label: "USER PROFILE", sub: "MUTATE ALIAS" },
    { id: "settings" as TabID, label: "SETTINGS", sub: "TOGGLE HARDWARE" },
  ];

  return (
    <div className="min-h-screen py-24 px-4 sm:px-10 max-w-[1200px] mx-auto font-mono text-[#f0f0f0]">
      
      {/* Realtime Interface Status Feedback */}
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

      {/* Global Interface Header (Admin Inputs Removed) */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-white/5 pb-8 select-none">
        <div>
          <span className="text-[0.6rem] text-[#a8ff00] uppercase tracking-[0.3em] font-black block mb-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            CORE CONTROL TERMINAL // NODE ID: <span className="text-white tracking-widest">{nodeId}</span>
          </span>
          <h1 style={{ fontFamily: "var(--font-barlow-condensed), sans-serif" }} className="text-3xl sm:text-4xl font-black tracking-wider text-white uppercase leading-none">
            Welcome, {profileName || "Explorer"}
          </h1>
          <p className="text-zinc-500 text-xs mt-2 tracking-wide">
            Access authorized via account terminal token <span className="text-zinc-400">{profileEmail}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Read-Only High-Contrast Membership Indicator Token */}
          <span className="bg-white/[0.03] border border-white/10 text-white px-4 py-2 rounded-sm text-[0.65rem] font-black tracking-widest uppercase shadow-md">
            CLEARANCE: <span className="text-[#a8ff00] ml-1">{tier}</span>
          </span>
          
          <button onClick={() => signOut({ callbackUrl: "/logout/successful" })} className="border border-white/10 hover:border-red-500 hover:text-red-400 bg-white/[0.02] text-zinc-400 px-4 py-2 rounded-sm text-[0.65rem] font-bold tracking-wider uppercase transition-all duration-200 shadow-md">
            Disconnect
          </button>
        </div>
      </div>

      {/* Main Structural Control Interface Grid */}
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 mt-10 items-start">
        
        {/* Navigation Sidebar Selector Menu Container */}
        <div className="flex flex-col gap-2 w-full bg-[#0a0a0a]/40 border border-white/5 p-4 rounded-sm backdrop-blur-md">
          <div className="text-[0.55rem] font-black tracking-[0.4em] text-zinc-600 uppercase px-3 mb-2 select-none">
            System Modules
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

        {/* Dynamic Display Port Content Grid Box */}
        <div className="bg-[#090909]/60 border border-white/5 p-6 sm:p-8 rounded-sm backdrop-blur-md min-h-[460px]">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
              
              {/* THE VAULT FILE PORTAL */}
              {activeTab === "vault" && (
                <VaultModule 
                  vaultDownloads={vaultDownloads} 
                  setVaultDownloads={setVaultDownloads} 
                  onNotify={triggerSaveNotification} 
                />
              )}
              
              {/* HISTORICAL LEDGER ACCOUNT ENTRIES */}
              {activeTab === "history" && (
                <HistoryModule 
                  purchases={purchases} 
                  setPurchases={setPurchases} 
                  onNotify={triggerSaveNotification} 
                />
              )}
              
              {/* ACCOUNT MEMBERSHIP TRACKER SLOTS (Upgrades point safely to store interfaces) */}
              {activeTab === "membership" && (
                <MembershipModule 
                  tier={tier} 
                  setTier={() => router.push("/music")} // Safely hooks to audio tracks tier upgrades
                  joinedDate={joinedDate} 
                  setJoinedDate={setJoinedDate} 
                  expeditions={expeditions} 
                  setExpeditions={setExpeditions} 
                  onNotify={triggerSaveNotification} 
                />
              )}
              
              {/* RE-MAPPED PROFILE DESCRIPTORS SUBMODULE */}
              {activeTab === "profile" && (
                <ProfileModule 
                  profileName={profileName} 
                  setProfileName={setProfileName} 
                  profileEmail={profileEmail} 
                  setProfileEmail={setProfileEmail} 
                  nodeId={nodeId} 
                  onNotify={handleUpdateProfile} 
                />
              )}
              
              {/* SYSTEM LEVEL DEVICE PREFERENCES METRIC TOGGLES */}
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