import React from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createServerSupabase } from "@/lib/supabaseServer";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  // 1. Authenticate session securely on the server edge
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const email = session.user.email;
  const name = session.user.name || "EXPLORER";
  const supabase = createServerSupabase();

  // 2. Fetch or automatically provision the secure user profile parameters
  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email)
    .single();

  if (!profile) {
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

    if (!createError && newProfile) {
      profile = newProfile;
    }
  }

  // 3. Perform concurrent relational data fetches instantly before page delivery
  const [purchasesResponse, vaultResponse, expeditionsResponse] = await Promise.all([
    supabase.from("purchases").select("*").eq("user_email", email).order("date", { ascending: false }),
    supabase.from("vault_downloads").select("*"),
    supabase.from("expeditions").select("*").eq("user_email", email)
  ]);

  return (
    <DashboardClient
      initialProfile={profile || { email, name, tier: "STANDARD ACCESS", node_id: "CC-PENDING-X", joined_date: "JUNE 2026" }}
      initialPurchases={purchasesResponse.data || []}
      initialVaultDownloads={vaultResponse.data || []}
      initialExpeditions={expeditionsResponse.data || []}
    />
  );
}