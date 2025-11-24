import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "@/i18n/config";
import { LOCALE_COOKIE_NAME, routing } from "@/i18n/routing";
import { LOCALE_COOKIE_CONFIG } from "@/lib/i18n/locale-cookie";
import { createRBACMiddleware } from "@/lib/rbac/middleware";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Create next-intl middleware for locale detection and routing
 * Configured to detect locale from cookies for persistence
 */
const intlMiddleware = createMiddleware(routing);

/**
 * Optimized middleware with i18n, JWT-based RBAC, and Supabase auth
 * - Handles locale detection and URL rewriting first
 * - Shares Supabase client and user between session and RBAC checks
 * - Eliminates duplicate getUser() calls
 * - Uses JWT claims for role/permissions (no database queries needed!)
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip i18n for API routes, static files, and other excluded paths
  const shouldSkipI18n =
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes("/favicon.ico") ||
    /\.(.*)$/.test(pathname); // Files with extensions

  // Handle i18n routing first (locale detection and URL rewriting)
  let intlResponse: NextResponse | null = null;
  if (!shouldSkipI18n) {
    // Check for locale preference in cookies
    const localeCookie = request.cookies.get(LOCALE_COOKIE_NAME)?.value;

    // If we have a locale cookie and it's valid, and the URL doesn't have a locale prefix,
    // we should redirect to the preferred locale
    const hasLocaleInPath = locales.some((loc) =>
      pathname.startsWith(`/${loc}`)
    );

    if (
      localeCookie &&
      locales.includes(localeCookie as any) &&
      !hasLocaleInPath &&
      pathname === "/"
    ) {
      // Redirect to the preferred locale
      const url = request.nextUrl.clone();
      url.pathname = `/${localeCookie}${pathname}`;
      const response = NextResponse.redirect(url);
      response.cookies.set(LOCALE_COOKIE_CONFIG.name, localeCookie, {
        maxAge: LOCALE_COOKIE_CONFIG.maxAge,
        path: LOCALE_COOKIE_CONFIG.path,
        sameSite: LOCALE_COOKIE_CONFIG.sameSite,
      });
      return response;
    }

    intlResponse = intlMiddleware(request);

    // Extract the locale from the response URL or pathname
    const responseUrl =
      intlResponse.headers.get("x-middleware-rewrite") ||
      intlResponse.headers.get("location") ||
      pathname;
    const localeMatch = responseUrl.match(/^\/(en|vi)(\/|$)/);
    const detectedLocale = localeMatch ? localeMatch[1] : defaultLocale;

    // Set the locale cookie to persist the preference
    intlResponse.cookies.set(LOCALE_COOKIE_CONFIG.name, detectedLocale, {
      maxAge: LOCALE_COOKIE_CONFIG.maxAge,
      path: LOCALE_COOKIE_CONFIG.path,
      sameSite: LOCALE_COOKIE_CONFIG.sameSite,
    });

    // If intl middleware returns a redirect (e.g., adding locale prefix), return it immediately
    if (
      intlResponse.status === 307 ||
      intlResponse.status === 308 ||
      intlResponse.status === 302
    ) {
      return intlResponse;
    }
  }

  // Extract locale from pathname for locale-aware auth checks
  const localeMatch = pathname.match(/^\/(en|vi)(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : null;
  const pathnameWithoutLocale = locale
    ? pathname.replace(`/${locale}`, "") || "/"
    : pathname;

  // Define auth pages (sign-in, sign-up) - check both with and without locale
  const authPages = ["/sign-in", "/sign-up"];
  const isAuthPage = authPages.includes(pathnameWithoutLocale);

  // Early exit for truly public paths (home, 403) and API routes
  const publicPaths = ["/", "/403"];
  const matchesPublicPath = (path: string) => {
    if (pathnameWithoutLocale === path) return true;
    if (path.includes("*")) {
      const regex = new RegExp(`^${path.replace(/\*/g, ".*")}`);
      return regex.test(pathnameWithoutLocale);
    }
    if (pathnameWithoutLocale.startsWith(`${path}/`)) return true;
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
    // Preserve locale in redirect
    url.pathname = locale ? `/${locale}/dashboard` : "/dashboard";
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

  // If we have an intl response (with locale handling), merge it with session response
  if (intlResponse) {
    // Copy session cookies to intl response
    const cookies = sessionResponse.cookies.getAll();
    for (const cookie of cookies) {
      intlResponse.cookies.set(cookie);
    }
    return intlResponse;
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
