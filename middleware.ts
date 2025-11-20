import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createRBACMiddleware } from "@/lib/rbac/middleware";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Optimized middleware with JWT-based RBAC
 * - Shares Supabase client and user between session and RBAC checks
 * - Eliminates duplicate getUser() calls
 * - Uses JWT claims for role/permissions (no database queries needed!)
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Define auth pages (sign-in, sign-up)
  const authPages = ["/sign-in", "/sign-up"];
  const isAuthPage = authPages.includes(pathname);

  // Early exit for truly public paths (home, 403) and API routes
  const publicPaths = ["/", "/403"];
  const matchesPublicPath = (path: string) => {
    if (pathname === path) return true;
    if (path.includes("*")) {
      const regex = new RegExp(`^${path.replace(/\*/g, ".*")}$`);
      return regex.test(pathname);
    }
    if (pathname.startsWith(`${path}/`)) return true;
    return false;
  };

  // Skip auth operations for API routes and truly public paths (but NOT auth pages)
  if (
    !isAuthPage &&
    (publicPaths.some(matchesPublicPath) || pathname.startsWith("/api/"))
  ) {
    return NextResponse.next();
  }

  // First, update the session (handles cookie management and gets user data)
  const {
    response: sessionResponse,
    user,
    supabase,
    session,
  } = await updateSession(request);

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (isAuthPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // If on auth page and not authenticated, allow access
  if (isAuthPage && !user) {
    return sessionResponse;
  }

  // Then, apply RBAC checks with shared user, session, and Supabase client
  const rbacMiddleware = createRBACMiddleware({ user, supabase, session });
  const rbacResponse = await rbacMiddleware(request);

  // If RBAC middleware returned a redirect, use that
  if (rbacResponse.status === 307 || rbacResponse.status === 308) {
    return rbacResponse;
  }

  // Otherwise, return the session response (with updated cookies)
  return sessionResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
