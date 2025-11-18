import type { NextRequest } from "next/server";
import { rbacMiddleware } from "@/lib/rbac/middleware";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // First, update the session (handles cookie management)
  const sessionResponse = await updateSession(request);

  // Then, apply RBAC checks
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
