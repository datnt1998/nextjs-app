/**
 * JWT Utilities for Supabase Custom Claims
 * Decodes access tokens to extract custom claims injected by Auth Hook
 */

import type { User } from "@supabase/supabase-js";
import { jwtDecode } from "jwt-decode";

/**
 * App roles matching the database enum
 */
export type AppRole = "owner" | "admin" | "manager" | "editor" | "viewer";

/**
 * Custom claims added to JWT by the custom_access_token_hook
 */
export interface CustomJWTClaims {
  user_role: AppRole;
  tenant_id: string;
  // Standard JWT claims
  sub?: string;
  email?: string;
  exp?: number;
  iat?: number;
}

/**
 * User profile extracted from JWT claims
 * This avoids database queries for RBAC checks
 */
export interface JWTUserProfile {
  id: string;
  role: AppRole;
  tenant_id: string;
  email?: string;
}

/**
 * Decode JWT access token and extract custom claims
 * @param accessToken - The JWT access token from Supabase session
 * @returns Custom claims including user_role and tenant_id
 */
export function decodeJWT(accessToken: string): CustomJWTClaims {
  try {
    return jwtDecode<CustomJWTClaims>(accessToken);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    // Return default claims if decode fails
    return {
      user_role: "viewer",
      tenant_id: "default",
    };
  }
}

/**
 * Extract user role from JWT access token
 * @param accessToken - The JWT access token
 * @returns User role or 'viewer' as default
 */
export function getUserRoleFromJWT(accessToken: string): AppRole {
  const claims = decodeJWT(accessToken);
  return claims.user_role || "viewer";
}

/**
 * Extract tenant ID from JWT access token
 * @param accessToken - The JWT access token
 * @returns Tenant ID or 'default'
 */
export function getTenantIdFromJWT(accessToken: string): string {
  const claims = decodeJWT(accessToken);
  return claims.tenant_id || "default";
}

/**
 * Create a UserProfile from Supabase User object
 * Extracts role and tenant from JWT if session exists
 * Falls back to app_metadata if available (for compatibility)
 *
 * @param user - Supabase User object
 * @param accessToken - Optional JWT access token (recommended)
 * @returns UserProfile for permission checking
 */
export function getUserProfileFromJWT(
  user: User,
  accessToken?: string
): JWTUserProfile {
  // If access token provided, decode it to get claims
  if (accessToken) {
    const claims = decodeJWT(accessToken);
    return {
      id: user.id,
      role: claims.user_role,
      tenant_id: claims.tenant_id,
      email: user.email,
    };
  }

  // Fallback to app_metadata (for compatibility during migration)
  const role = (user.app_metadata?.user_role as AppRole) || "viewer";
  const tenant_id = (user.app_metadata?.tenant_id as string) || "default";

  return {
    id: user.id,
    role,
    tenant_id,
    email: user.email,
  };
}

/**
 * Check if JWT token is expired
 * @param accessToken - The JWT access token
 * @returns true if token is expired
 */
export function isJWTExpired(accessToken: string): boolean {
  try {
    const claims = decodeJWT(accessToken);
    if (!claims.exp) return false;

    const now = Math.floor(Date.now() / 1000);
    return claims.exp < now;
  } catch {
    return true;
  }
}

/**
 * Get all custom claims from JWT
 * Useful for debugging or displaying user info
 * @param accessToken - The JWT access token
 * @returns All custom claims
 */
export function getJWTClaims(accessToken: string): CustomJWTClaims {
  return decodeJWT(accessToken);
}
