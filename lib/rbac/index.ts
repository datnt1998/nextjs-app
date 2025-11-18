/**
 * RBAC (Role-Based Access Control) Module
 * Exports permission utilities and configurations
 */

export {
  createRBACMiddleware,
  DEFAULT_PROTECTED_ROUTES,
  type RBACMiddlewareOptions,
  type RouteConfig,
  rbacMiddleware,
} from "./middleware";
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
