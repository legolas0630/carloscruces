import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // 1. Initialize an expandable response instance to intercept headers
  let supabaseResponse = NextResponse.next({
    request,
  });

  // 2. Spin up the lightweight server client instance mapped to request cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Sync changes straight back into the incoming request stream
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          
          // Re-instantiate the response pipeline with updated headers
          supabaseResponse = NextResponse.next({
            request,
          });
          
          // Commit refreshed session token chunks back to the client browser
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  /**
   * 3. Run a secure token check against the database.
   * This is a secure server-side check that validates the user's cookie session
   * and automatically handles background token rotation if it's expired.
   */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isDashboardRoute = pathname.startsWith("/dashboard");

  // 4. Intercept unauthorized requests at the server edge boundary
  if (isDashboardRoute && !user) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Pass control forward with refreshed cookies attached
  return supabaseResponse;
}

// 5. High-Efficiency Production Matcher Framework
export const config = {
  /**
   * CRITICAL PERFORMANCE RULE:
   * We intercept all paths except internal compilation files, static chunks, 
   * icons, or media folders. This ensures sessions refresh seamlessly while 
   * browsing public sections (like /music or /merch) so users don't get 
   * randomly logged out, without adding latency to media tracking engines.
   */
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|artwork|beats|merch|logo.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};