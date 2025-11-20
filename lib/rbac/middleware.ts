/**
 * RBAC Middleware - Updated for Supabase JWT-based RBAC
 * Provides route protection based on user roles from JWT claims
 * No database queries needed - everything comes from JWT!
 */

import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import type { Database } from "@/types/database.types";
import {
  createUserProfileFromJWT,
  hasAnyPermission,
  type Permission,
  type UserRole,
} from "./permissions";

/**
 * Route configuration for RBAC protection
 */
export interface RouteConfig {
  /** Path pattern to match (supports wildcards) */
  path: string;
  /** Required permissions (user must have at least one) */
  permissions?: Permission[];
  /** Required roles (user must have one of these roles) */
  roles?: UserRole[];
  /** Whether authentication is required (default: true) */
  requireAuth?: boolean;
}

/**
 * Default protected routes configuration
 * Can be customized per application needs
 */
export const DEFAULT_PROTECTED_ROUTES: RouteConfig[] = [
  {
    path: "/dashboard",
    requireAuth: true,
  },
  {
    path: "/dashboard/users",
    permissions: ["users:view" as Permission],
  },
  {
    path: "/dashboard/settings",
    permissions: ["settings:view" as Permission],
  },
  {
    path: "/dashboard/analytics",
    permissions: ["analytics:view" as Permission],
  },
];

/**
 * Check if a path matches a route pattern
 * Supports wildcards (*)
 */
function matchesPath(pathname: string, pattern: string): boolean {
  // Exact match
  if (pathname === pattern) {
    return true;
  }

  // Wildcard match
  if (pattern.includes("*")) {
    const regexPattern = pattern.replace(/\*/g, ".*");
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(pathname);
  }

  // Prefix match (e.g., /dashboard matches /dashboard/*)
  if (pathname.startsWith(`${pattern}/`)) {
    return true;
  }

  return false;
}

/**
 * Find matching route configuration for a given pathname
 * Expects routes to be pre-sorted by path length (longest first)
 */
function findMatchingRoute(
  pathname: string,
  routes: RouteConfig[]
): RouteConfig | null {
  // Routes should already be sorted by path length (longest first)
  // This eliminates O(n log n) sorting on every request
  for (const route of routes) {
    if (matchesPath(pathname, route.path)) {
      return route;
    }
  }

  return null;
}

/**
 * RBAC middleware options
 */
export interface RBACMiddlewareOptions {
  /** Custom route configurations */
  routes?: RouteConfig[];
  /** Path to redirect for unauthenticated users */
  signInPath?: string;
  /** Path to redirect for unauthorized users */
  forbiddenPath?: string;
  /** Public paths that don't require authentication */
  publicPaths?: string[];
  /** Optional authenticated user (to avoid duplicate getUser calls) */
  user?: User | null;
  /** Optional Supabase client (to avoid creating a new one) */
  supabase?: ReturnType<typeof createServerClient<Database>>;
  /** Optional session (to avoid duplicate getSession calls) */
  session?: Awaited<
    ReturnType<
      ReturnType<typeof createServerClient<Database>>["auth"]["getSession"]
    >
  >["data"]["session"];
}

/**
 * Create RBAC middleware with custom configuration
 * Updated to use JWT claims instead of database queries
 * Optimized to avoid duplicate getSession() calls
 */
export function createRBACMiddleware(options: RBACMiddlewareOptions = {}) {
  const {
    routes = DEFAULT_PROTECTED_ROUTES,
    signInPath = "/sign-in",
    forbiddenPath = "/403",
    publicPaths = ["/", "/sign-in", "/sign-up", "/403"],
    user: providedUser,
    supabase: providedSupabase,
    session: providedSession,
  } = options;

  // Pre-sort routes once for better performance (O(1) vs O(n log n) per request)
  const sortedRoutes = [...routes].sort(
    (a, b) => b.path.length - a.path.length
  );

  return async function rbacMiddleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Skip public paths (early exit before any auth operations)
    if (publicPaths.some((path) => matchesPath(pathname, path))) {
      return NextResponse.next();
    }

    // Skip API routes (they should handle their own auth)
    if (pathname.startsWith("/api/")) {
      return NextResponse.next();
    }

    let supabaseResponse = NextResponse.next({
      request,
    });

    // Use provided Supabase client or create a new one
    let supabase = providedSupabase;
    if (!supabase) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        console.error("Missing Supabase environment variables");
        return NextResponse.next();
      }

      supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            for (const { name, value } of cookiesToSet) {
              request.cookies.set(name, value);
            }
            supabaseResponse = NextResponse.next({
              request,
            });
            for (const { name, value, options } of cookiesToSet) {
              supabaseResponse.cookies.set(name, value, options);
            }
          },
        },
      });
    }

    // Use provided user or get authenticated user
    let user = providedUser;
    if (user === undefined) {
      const {
        data: { user: fetchedUser },
      } = await supabase.auth.getUser();
      user = fetchedUser;
    }

    // Find matching route configuration (using pre-sorted routes)
    const routeConfig = findMatchingRoute(pathname, sortedRoutes);

    // If no route config found, allow access (not a protected route)
    if (!routeConfig) {
      return supabaseResponse;
    }

    // Check authentication requirement
    if (routeConfig.requireAuth !== false && !user) {
      const url = request.nextUrl.clone();
      url.pathname = signInPath;
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    // If user is authenticated and route has role/permission requirements
    if (user && (routeConfig.roles || routeConfig.permissions)) {
      // Use provided session or get it (optimized to avoid duplicate calls)
      let session = providedSession;
      if (!session) {
        const {
          data: { session: fetchedSession },
        } = await supabase.auth.getSession();
        session = fetchedSession;
      }

      if (!session) {
        const url = request.nextUrl.clone();
        url.pathname = signInPath;
        return NextResponse.redirect(url);
      }

      // Create user profile from JWT claims (no database query needed!)
      const userProfile = createUserProfileFromJWT(user, session.access_token);

      // Check role requirement
      if (routeConfig.roles && !routeConfig.roles.includes(userProfile.role)) {
        const url = request.nextUrl.clone();
        url.pathname = forbiddenPath;
        return NextResponse.redirect(url);
      }

      // Check permission requirement
      if (routeConfig.permissions) {
        const hasRequiredPermission = hasAnyPermission(
          userProfile,
          routeConfig.permissions
        );

        if (!hasRequiredPermission) {
          const url = request.nextUrl.clone();
          url.pathname = forbiddenPath;
          return NextResponse.redirect(url);
        }
      }
    }

    return supabaseResponse;
  };
}

/**
 * Default RBAC middleware instance
 * Can be used directly in middleware.ts
 */
export const rbacMiddleware = createRBACMiddleware();
