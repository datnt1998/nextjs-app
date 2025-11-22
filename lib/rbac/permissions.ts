/**
 * RBAC Permission Engine
 * Defines role-based permissions and provides utilities for permission checking
 * Updated to work with Supabase JWT-based RBAC pattern
 */

import type { User } from "@supabase/supabase-js";
import type { AppRole } from "./jwt-utils";
import { getUserProfileFromJWT } from "./jwt-utils";

// Type alias for user role (matches AppRole from JWT)
export type UserRole = AppRole;

// Define all available permissions in the system
export const PERMISSIONS = {
  // Item permissions
  ITEMS_VIEW: "items:view",
  ITEMS_CREATE: "items:create",
  ITEMS_UPDATE: "items:update",
  ITEMS_DELETE: "items:delete",
  ITEMS_UPDATE_ANY: "items:update:any",
  ITEMS_DELETE_ANY: "items:delete:any",

  // User permissions
  USERS_VIEW: "users:view",
  USERS_CREATE: "users:create",
  USERS_UPDATE: "users:update",
  USERS_DELETE: "users:delete",
  USERS_MANAGE_ROLES: "users:manage:roles",

  // Settings permissions
  SETTINGS_VIEW: "settings:view",
  SETTINGS_UPDATE: "settings:update",

  // Analytics permissions
  ANALYTICS_VIEW: "analytics:view",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * Role-based permission configuration
 * Maps each role to its default permissions
 */
export const RolePermissions: Record<UserRole, Permission[]> = {
  owner: [
    // Owners have all permissions
    PERMISSIONS.ITEMS_VIEW,
    PERMISSIONS.ITEMS_CREATE,
    PERMISSIONS.ITEMS_UPDATE,
    PERMISSIONS.ITEMS_DELETE,
    PERMISSIONS.ITEMS_UPDATE_ANY,
    PERMISSIONS.ITEMS_DELETE_ANY,
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_UPDATE,
    PERMISSIONS.USERS_DELETE,
    PERMISSIONS.USERS_MANAGE_ROLES,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_UPDATE,
    PERMISSIONS.ANALYTICS_VIEW,
  ],
  admin: [
    // Admins have most permissions except user deletion and role management
    PERMISSIONS.ITEMS_VIEW,
    PERMISSIONS.ITEMS_CREATE,
    PERMISSIONS.ITEMS_UPDATE,
    PERMISSIONS.ITEMS_DELETE,
    PERMISSIONS.ITEMS_UPDATE_ANY,
    PERMISSIONS.ITEMS_DELETE_ANY,
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_UPDATE,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_UPDATE,
    PERMISSIONS.ANALYTICS_VIEW,
  ],
  manager: [
    // Managers can manage items and view users
    PERMISSIONS.ITEMS_VIEW,
    PERMISSIONS.ITEMS_CREATE,
    PERMISSIONS.ITEMS_UPDATE,
    PERMISSIONS.ITEMS_DELETE,
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.ANALYTICS_VIEW,
  ],
  editor: [
    // Editors can create and manage their own items
    PERMISSIONS.ITEMS_VIEW,
    PERMISSIONS.ITEMS_CREATE,
    PERMISSIONS.ITEMS_UPDATE,
    PERMISSIONS.ITEMS_DELETE,
    PERMISSIONS.SETTINGS_VIEW,
  ],
  viewer: [
    // Viewers can only view items
    PERMISSIONS.ITEMS_VIEW,
    PERMISSIONS.SETTINGS_VIEW,
  ],
};

/**
 * User profile with RBAC information
 * Updated to work with JWT-based roles (permissions derived from role)
 */
export interface UserProfile {
  id: string;
  role: UserRole;
  permissions: string[]; // Derived from role, kept for backward compatibility
  tenant_id: string;
}

/**
 * Check if a user has a specific permission
 * @param user - User profile with role and permissions
 * @param permission - Permission to check
 * @returns true if user has the permission
 */
export function hasPermission(
  user: UserProfile | null | undefined,
  permission: Permission,
): boolean {
  if (!user) {
    return false;
  }

  // Owners and admins have all permissions by default
  if (user.role === "owner" || user.role === "admin") {
    return true;
  }

  // Check role-based permissions
  const rolePermissions = RolePermissions[user.role] || [];
  if (rolePermissions.includes(permission)) {
    return true;
  }

  // Check user-specific permissions (custom permissions granted to the user)
  if (user.permissions?.includes(permission)) {
    return true;
  }

  return false;
}

/**
 * Check if a user has any of the specified permissions
 * @param user - User profile with role and permissions
 * @param permissions - Array of permissions to check
 * @returns true if user has at least one of the permissions
 */
export function hasAnyPermission(
  user: UserProfile | null | undefined,
  permissions: Permission[],
): boolean {
  if (!user) {
    return false;
  }

  // Owners and admins have all permissions by default
  if (user.role === "owner" || user.role === "admin") {
    return true;
  }

  // Check if user has any of the specified permissions
  return permissions.some((permission) => hasPermission(user, permission));
}

/**
 * Check if a user has all of the specified permissions
 * @param user - User profile with role and permissions
 * @param permissions - Array of permissions to check
 * @returns true if user has all of the permissions
 */
export function hasAllPermissions(
  user: UserProfile | null | undefined,
  permissions: Permission[],
): boolean {
  if (!user) {
    return false;
  }

  // Owners and admins have all permissions by default
  if (user.role === "owner" || user.role === "admin") {
    return true;
  }

  // Check if user has all of the specified permissions
  return permissions.every((permission) => hasPermission(user, permission));
}

/**
 * Get all permissions for a user based on their role and custom permissions
 * @param user - User profile with role and permissions
 * @returns Array of all permissions the user has
 */
export function getUserPermissions(
  user: UserProfile | null | undefined,
): Permission[] {
  if (!user) {
    return [];
  }

  // Get role-based permissions
  const rolePermissions = RolePermissions[user.role] || [];

  // Combine with user-specific permissions
  const customPermissions = (user.permissions || []).filter(
    (p): p is Permission =>
      Object.values(PERMISSIONS).includes(p as Permission),
  );

  // Return unique permissions
  return Array.from(new Set([...rolePermissions, ...customPermissions]));
}

/**
 * Check if a user can perform an action on a resource
 * @param user - User profile with role and permissions
 * @param permission - Permission required for the action
 * @param resourceOwnerId - ID of the resource owner (optional)
 * @returns true if user can perform the action
 */
export function canPerformAction(
  user: UserProfile | null | undefined,
  permission: Permission,
  resourceOwnerId?: string,
): boolean {
  if (!user) {
    return false;
  }

  // Check if user has the permission
  if (hasPermission(user, permission)) {
    return true;
  }

  // If checking update/delete on own resource
  if (resourceOwnerId && user.id === resourceOwnerId) {
    // Check if user has the base permission (without :any suffix)
    const basePermission = permission.replace(":any", "") as Permission;
    if (hasPermission(user, basePermission)) {
      return true;
    }
  }

  return false;
}

/**
 * Create UserProfile from Supabase User and JWT access token
 * This is the recommended way to get user profile with JWT-based RBAC
 *
 * @param user - Supabase User object
 * @param accessToken - JWT access token from session (optional but recommended)
 * @returns UserProfile for permission checking
 */
export function createUserProfileFromJWT(
  user: User,
  accessToken?: string,
): UserProfile {
  const jwtProfile = getUserProfileFromJWT(user, accessToken);

  // Get permissions from role
  const rolePermissions = RolePermissions[jwtProfile.role] || [];

  return {
    id: jwtProfile.id,
    role: jwtProfile.role,
    tenant_id: jwtProfile.tenant_id,
    permissions: rolePermissions,
  };
}

/**
 * Get permissions array from a role
 * @param role - User role
 * @returns Array of permissions for that role
 */
export function getPermissionsFromRole(role: UserRole): Permission[] {
  return RolePermissions[role] || [];
}
