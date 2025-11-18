"use client";

import { hasAnyPermission, type Permission } from "@/lib/rbac/permissions";
import { useUserStore } from "@/stores/user.store";

interface CanAnyProps {
  /**
   * Array of permissions - user must have at least one
   */
  permissions: Permission[];
  /**
   * Content to render when user has at least one of the required permissions
   */
  children: React.ReactNode;
  /**
   * Optional fallback content to render when user lacks all permissions
   * @default null
   */
  fallback?: React.ReactNode;
}

/**
 * CanAny Component - Multiple permission check (OR logic)
 *
 * Conditionally renders children if the user has ANY of the specified permissions.
 * Useful when multiple permissions can grant access to a feature.
 *
 * @example
 * ```tsx
 * // Show edit menu if user can update OR delete
 * <CanAny permissions={[PERMISSIONS.ITEMS_UPDATE, PERMISSIONS.ITEMS_DELETE]}>
 *   <EditMenu />
 * </CanAny>
 *
 * // With fallback
 * <CanAny
 *   permissions={[PERMISSIONS.USERS_VIEW, PERMISSIONS.USERS_UPDATE]}
 *   fallback={<p>No user management access</p>}
 * >
 *   <UserManagementPanel />
 * </CanAny>
 * ```
 */
export function CanAny({
  permissions,
  children,
  fallback = null,
}: CanAnyProps) {
  const user = useUserStore((state) => state.user);

  // Convert user store format to UserProfile format expected by hasAnyPermission
  const userProfile = user
    ? {
        id: user.id,
        role: user.role,
        permissions: user.permissions,
        tenant_id: user.tenant_id,
      }
    : null;

  if (!hasAnyPermission(userProfile, permissions)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
