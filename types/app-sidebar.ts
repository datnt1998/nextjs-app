import type { Icons } from "@/components/icons/registry";

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Menu item data structure
 * Extends the NavItem from config/site.ts with runtime state
 */
export interface SidebarMenuItem {
  title: string;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  badge?: string | number;
  permissions?: string[]; // Required permissions to view this item
  items?: SidebarMenuSubItem[];
}

/**
 * Sub-menu item data structure
 */
export interface SidebarMenuSubItem {
  title: string;
  url: string;
  isActive?: boolean;
  permissions?: string[]; // Required permissions to view this sub-item
}

/**
 * Group data structure
 */
export interface SidebarGroupData {
  label: string;
  items: SidebarMenuItem[];
  action?: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    onClick: () => void;
  };
}

/**
 * Project/Workspace data structure
 */
export interface SidebarProject {
  name: string;
  url: string;
  icon: keyof typeof Icons;
}

/**
 * User data structure for sidebar footer
 */
export interface SidebarUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Default sidebar width (desktop)
 */
export const SIDEBAR_WIDTH = "16rem";

/**
 * Default sidebar width (mobile)
 */
export const SIDEBAR_WIDTH_MOBILE = "18rem";

/**
 * Keyboard shortcut to toggle sidebar
 */
export const SIDEBAR_KEYBOARD_SHORTCUT = "b";

/**
 * Cookie name for persisting sidebar state
 */
export const SIDEBAR_COOKIE_NAME = "sidebar:state";

/**
 * Cookie max age (7 days)
 */
export const SIDEBAR_COOKIE_MAX_AGE = 604800;
