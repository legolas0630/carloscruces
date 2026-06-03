import { createClient } from "@supabase/supabase-js";

export function createServerSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("SERVER ERROR: Supabase environment configuration keys are missing.");
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}