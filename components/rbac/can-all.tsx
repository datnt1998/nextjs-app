"use client";

import { hasAllPermissions, type Permission } from "@/lib/rbac/permissions";
import { useUserStore } from "@/stores/user.store";

interface CanAllProps {
  /**
   * Array of permissions - user must have all of them
   */
  permissions: Permission[];
  /**
   * Content to render when user has all of the required permissions
   */
  children: React.ReactNode;
  /**
   * Optional fallback content to render when user lacks any permission
   * @default null
   */
  fallback?: React.ReactNode;
}

/**
 * CanAll Component - Multiple permission check (AND logic)
 *
 * Conditionally renders children if the user has ALL of the specified permissions.
 * Useful when multiple permissions are required to access a feature.
 *
 * @example
 * ```tsx
 * // Show admin panel only if user has both permissions
 * <CanAll permissions={[PERMISSIONS.USERS_VIEW, PERMISSIONS.USERS_UPDATE]}>
 *   <AdminPanel />
 * </CanAll>
 *
 * // With fallback
 * <CanAll
 *   permissions={[PERMISSIONS.SETTINGS_VIEW, PERMISSIONS.SETTINGS_UPDATE]}
 *   fallback={<p>Full settings access required</p>}
 * >
 *   <SettingsEditor />
 * </CanAll>
 * ```
 */
export function CanAll({
  permissions,
  children,
  fallback = null,
}: CanAllProps) {
  const user = useUserStore((state) => state.user);

  // Convert user store format to UserProfile format expected by hasAllPermissions
  const userProfile = user
    ? {
        id: user.id,
        role: user.role,
        permissions: user.permissions,
        tenant_id: user.tenant_id,
      }
    : null;

  if (!hasAllPermissions(userProfile, permissions)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
