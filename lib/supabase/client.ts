import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if variables are configured correctly
const hasValidConfig = !!(supabaseUrl && supabaseAnonKey);

if (!hasValidConfig && typeof window !== "undefined") {
  console.warn("WARNING: Supabase configuration parameters missing from your environment variables.");
}

/**
 * UPGRADED BROWSER INSTANCE
 * Uses createBrowserClient to automatically pass user sessions 
 * down to cookies, allowing server-side components to read them natively.
 */
export const supabase = createBrowserClient(
  hasValidConfig ? supabaseUrl! : "https://placeholder-id.supabase.co",
  hasValidConfig ? supabaseAnonKey! : "placeholder-key-for-build-validation"
);