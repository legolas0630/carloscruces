import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if variables are configured correctly
const hasValidConfig = supabaseUrl && supabaseAnonKey;

if (!hasValidConfig && typeof window !== "undefined") {
  console.warn("WARNING: Supabase configuration parameters missing from your environment variables.");
}

// If variables are missing at build time, we use fallback strings so Next.js can compile.
// At runtime, Vercel will inject your real production keys automatically.
export const supabase = createClient(
  hasValidConfig ? supabaseUrl : "https://placeholder-id.supabase.co",
  hasValidConfig ? supabaseAnonKey : "placeholder-key-for-build-validation"
);