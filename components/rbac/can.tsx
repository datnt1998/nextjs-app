"use client";

import { hasPermission, type Permission } from "@/lib/rbac/permissions";
import { useUserStore } from "@/stores/user.store";

interface CanProps {
  /**
   * The permission required to render the children
   */
  permission: Permission;
  /**
   * Content to render when user has the required permission
   */
  children: React.ReactNode;
  /**
   * Optional fallback content to render when user lacks the permission
   * @default null
   */
  fallback?: React.ReactNode;
}

/**
 * Can Component - Permission-based rendering
 *
 * Conditionally renders children based on user permissions.
 * Uses the RBAC permission system to check if the current user
 * has the required permission.
 *
 * @example
 * ```tsx
 * // Hide component when user lacks permission
 * <Can permission={PERMISSIONS.ITEMS_CREATE}>
 *   <Button>Add Item</Button>
 * </Can>
 *
 * // Show fallback when user lacks permission
 * <Can
 *   permission={PERMISSIONS.ITEMS_DELETE}
 *   fallback={<p>You don't have permission to delete items</p>}
 * >
 *   <Button variant="danger">Delete</Button>
 * </Can>
 * ```
 */
export function Can({ permission, children, fallback = null }: CanProps) {
  const user = useUserStore((state) => state.user);

  // Convert user store format to UserProfile format expected by hasPermission
  const userProfile = user
    ? {
        id: user.id,
        role: user.role,
        permissions: user.permissions,
        tenant_id: user.tenant_id,
      }
    : null;

  if (!hasPermission(userProfile, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
