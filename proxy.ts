// Edge proxy (formerly middleware) — runs before every request reaches the server.
// Next.js 16 deprecated middleware.ts in favor of proxy.ts.
// CRITICAL: No Prisma or Node APIs here. Runs on the Edge runtime.
// Uses auth() initialized with the edge-only authConfig.

import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

// Route protection matrix
const PROTECTED_ROUTES = {
  "/dashboard": ["STUDENT", "INSTRUCTOR", "ADMIN"],
  "/instructor": ["INSTRUCTOR", "ADMIN"],
  "/admin": ["ADMIN"],
  "/notifications": ["STUDENT", "INSTRUCTOR", "ADMIN"],
} as const;

const AUTH_ROUTES = ["/login", "/register"];

export default auth(function proxy(req) {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Prevent logged-in users from accessing auth pages
  if (AUTH_ROUTES.includes(pathname)) {
    if (session?.user) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Determine if this route requires protection
  const matchedRoute = Object.keys(PROTECTED_ROUTES).find((route) =>
    pathname.startsWith(route),
  );

  if (!matchedRoute) return NextResponse.next();

  // No session — redirect to login with callbackUrl
  if (!session?.user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Has session but wrong role — redirect to unauthorized
  const allowedRoles =
    PROTECTED_ROUTES[matchedRoute as keyof typeof PROTECTED_ROUTES];
  const userRole = session.user.role;

  if (!allowedRoles.includes(userRole as never)) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match all routes except static files, _next, and public API routes
    "/((?!_next/static|_next/image|favicon.ico|api/webhooks|api/auth).*)",
  ],
};
