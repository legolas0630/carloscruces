import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createServerSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("SERVER ERROR: Supabase environment configuration keys are missing.");
  }

  const cookieStore = cookies();

  /**
   * UPGRADED SERVER INSTANCE
   * Utilizes createServerClient to dynamically read, pass, and mutate
   * session tokens straight through the Next.js request headers chunk.
   */
  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The setAll method can be safely ignored if called from a Server Component.
            // Next.js handles cookie mutations inside Server Actions and Route Handlers natively.
          }
        },
      },
    }
  );
}