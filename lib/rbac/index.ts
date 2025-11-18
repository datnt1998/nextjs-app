/**
 * RBAC (Role-Based Access Control) Module
 * Exports permission utilities and configurations
 */

export {
  canPerformAction,
  getUserPermissions,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
  PERMISSIONS,
  type Permission,
  RolePermissions,
  type UserProfile,
  type UserRole,
} from "./permissions";
