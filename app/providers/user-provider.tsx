"use client";

import { useEffect } from "react";
import { getUserProfileFromJWT } from "@/lib/rbac/jwt-utils";
import { RolePermissions } from "@/lib/rbac/permissions";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/stores/user.store";

/**
 * UserProvider - Manages user state and RBAC initialization
 *
 * Responsibilities:
 * - Subscribe to Supabase auth state changes
 * - Extract user profile from JWT on sign-in (no database queries)
 * - Derive permissions from user role
 * - Sync user profile to Zustand store
 * - Clear store on sign-out
 *
 * Architecture:
 * - Uses JWT-only approach (no profile table queries)
 * - Role and tenant_id come from JWT custom claims
 * - Permissions are derived from role using RolePermissions mapping
 */
export function UserProvider({ children }: { children: React.ReactNode }) {
  const { setUser, clearUser } = useUserStore();

  useEffect(() => {
    const supabase = createClient();

    // Initialize user state from current session
    const initializeUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user && session.access_token) {
        const jwtProfile = getUserProfileFromJWT(
          session.user,
          session.access_token
        );

        // Derive permissions from role
        const permissions = RolePermissions[jwtProfile.role] || [];

        // Update user store with JWT profile
        setUser({
          id: jwtProfile.id,
          email: jwtProfile.email || "",
          full_name: null, // Not available in JWT
          avatar_url: null, // Not available in JWT
          role: jwtProfile.role,
          tenant_id: jwtProfile.tenant_id,
          permissions,
        });
      }
    };

    // Initialize on mount
    initializeUser();

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user && session.access_token) {
        const jwtProfile = getUserProfileFromJWT(
          session.user,
          session.access_token
        );

        // Derive permissions from role
        const permissions = RolePermissions[jwtProfile.role] || [];

        // Update user store with JWT profile
        setUser({
          id: jwtProfile.id,
          email: jwtProfile.email || "",
          full_name: null,
          avatar_url: null,
          role: jwtProfile.role,
          tenant_id: jwtProfile.tenant_id,
          permissions,
        });
      } else if (event === "SIGNED_OUT") {
        // Clear user store on sign out
        clearUser();
      } else if (event === "TOKEN_REFRESHED" && session?.access_token) {
        // Update user profile when token is refreshed (role might have changed)
        const jwtProfile = getUserProfileFromJWT(
          session.user,
          session.access_token
        );

        const permissions = RolePermissions[jwtProfile.role] || [];

        setUser({
          id: jwtProfile.id,
          email: jwtProfile.email || "",
          full_name: null,
          avatar_url: null,
          role: jwtProfile.role,
          tenant_id: jwtProfile.tenant_id,
          permissions,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, clearUser]);

  return <>{children}</>;
}
