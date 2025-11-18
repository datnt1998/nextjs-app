/**
 * RBAC Middleware
 * Provides route protection based on user roles and permissions
 */

import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import type { Database } from "@/types/database.types";
import {
  hasAnyPermission,
  hasPermission,
  type Permission,
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
  roles?: Array<"owner" | "admin" | "manager" | "editor" | "viewer">;
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
  if (pathname.startsWith(pattern + "/")) {
    return true;
  }

  return false;
}

/**
 * Find matching route configuration for a given pathname
 */
function findMatchingRoute(
  pathname: string,
  routes: RouteConfig[]
): RouteConfig | null {
  // Find the most specific matching route (longest path first)
  const sortedRoutes = [...routes].sort(
    (a, b) => b.path.length - a.path.length
  );

  for (const route of sortedRoutes) {
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
}

/**
 * Create RBAC middleware with custom configuration
 */
export function createRBACMiddleware(options: RBACMiddlewareOptions = {}) {
  const {
    routes = DEFAULT_PROTECTED_ROUTES,
    signInPath = "/sign-in",
    forbiddenPath = "/403",
    publicPaths = ["/", "/sign-in", "/sign-up", "/403"],
  } = options;

  return async function rbacMiddleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Skip public paths
    if (publicPaths.some((path) => matchesPath(pathname, path))) {
      return NextResponse.next();
    }

    // Skip API routes (they should handle their own auth)
    if (pathname.startsWith("/api/")) {
      return NextResponse.next();
    }

    // Create Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables");
      return NextResponse.next();
    }

    let supabaseResponse = NextResponse.next({
      request,
    });

    const supabase = createServerClient<Database>(
      supabaseUrl,
      supabaseAnonKey,
      {
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
      }
    );

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Find matching route configuration
    const routeConfig = findMatchingRoute(pathname, routes);

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
      // Fetch user profile with role and permissions
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("id, role, permissions, tenant_id")
        .eq("id", user.id)
        .single();

      if (error || !profile) {
        console.error("Error fetching user profile:", error);
        const url = request.nextUrl.clone();
        url.pathname = signInPath;
        return NextResponse.redirect(url);
      }

      // Check role requirement
      if (routeConfig.roles && !routeConfig.roles.includes(profile.role)) {
        const url = request.nextUrl.clone();
        url.pathname = forbiddenPath;
        return NextResponse.redirect(url);
      }

      // Check permission requirement
      if (routeConfig.permissions) {
        const userProfile = {
          id: profile.id,
          role: profile.role,
          permissions: profile.permissions || [],
          tenant_id: profile.tenant_id,
        };

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
