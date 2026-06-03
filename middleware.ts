// Renamed from middlware.ts to middleware.ts for Next.js detection
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Retrieve the secure session token from the request headers
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 2. Define your protected route parameters
  const isDashboardRoute = pathname.startsWith("/dashboard");

  // 3. Intercept unauthorized requests at the server edge
  if (isDashboardRoute && !session) {
    // Safely re-route to the credential entry screen
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Allow the request to proceed uninterrupted if checks pass
  return NextResponse.next();
}

// 4. Configure performance optimization matchers
export const config = {
  /*
   * Matcher rules tell Next.js exactly which paths to pass through this middleware.
   * This completely avoids running checks on images, static files, or media assets.
   */
  matcher: ["/dashboard/:path*"],
};