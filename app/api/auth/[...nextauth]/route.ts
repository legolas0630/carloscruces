// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Import cleanly from the config home

const handler = NextAuth(authOptions);

// Next.js App Router only wants to see these named HTTP verbs
export { handler as GET, handler as POST };