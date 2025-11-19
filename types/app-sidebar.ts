import type * as React from "react";

// ============================================================================
// Provider Types
// ============================================================================

export interface SidebarProviderProps {
  /**
   * Default open state of the sidebar.
   * @default true
   */
  defaultOpen?: boolean;

  /**
   * Controlled open state of the sidebar.
   */
  open?: boolean;

  /**
   * Callback when the open state changes (controlled mode).
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Custom CSS properties for sidebar width.
   * Use --sidebar-width and --sidebar-width-mobile
   */
  style?: React.CSSProperties & {
    "--sidebar-width"?: string;
    "--sidebar-width-mobile"?: string;
  };

  children?: React.ReactNode;
  className?: string;
}

// ============================================================================
// Hook Return Types
// ============================================================================

export interface UseSidebarReturn {
  /**
   * Current state of the sidebar: "expanded" or "collapsed"
   */
  state: "expanded" | "collapsed";

  /**
   * Whether the sidebar is open (desktop)
   */
  open: boolean;

  /**
   * Set the open state (desktop)
   */
  setOpen: (open: boolean | ((open: boolean) => boolean)) => void;

  /**
   * Whether the sidebar is open on mobile
   */
  openMobile: boolean;

  /**
   * Set the open state on mobile
   */
  setOpenMobile: (open: boolean) => void;

  /**
   * Whether the current viewport is mobile
   */
  isMobile: boolean;

  /**
   * Toggle the sidebar (works for both desktop and mobile)
   */
  toggleSidebar: () => void;
}

// ============================================================================
// Sidebar Component Types
// ============================================================================

export interface SidebarProps extends React.ComponentProps<"div"> {
  /**
   * Side of the viewport where the sidebar should appear
   * @default "left"
   */
  side?: "left" | "right";

  /**
   * Visual variant of the sidebar
   * @default "sidebar"
   */
  variant?: "sidebar" | "floating" | "inset";

  /**
   * Collapsible behavior of the sidebar
   * - offcanvas: slides in/out from the side
   * - icon: collapses to icons only
   * - none: not collapsible
   * @default "offcanvas"
   */
  collapsible?: "offcanvas" | "icon" | "none";

  children?: React.ReactNode;
  className?: string;
}

export interface SidebarHeaderProps extends React.ComponentProps<"div"> {
  children?: React.ReactNode;
  className?: string;
}

export interface SidebarFooterProps extends React.ComponentProps<"div"> {
  children?: React.ReactNode;
  className?: string;
}

export interface SidebarContentProps extends React.ComponentProps<"div"> {
  children?: React.ReactNode;
  className?: string;
}

export interface SidebarInsetProps extends React.ComponentProps<"main"> {
  children?: React.ReactNode;
  className?: string;
}

export interface SidebarRailProps extends React.ComponentProps<"button"> {
  children?: React.ReactNode;
  className?: string;
}

// ============================================================================
// Group Component Types
// ============================================================================

export interface SidebarGroupProps extends React.ComponentProps<"div"> {
  children?: React.ReactNode;
  className?: string;
}

export interface SidebarGroupLabelProps extends React.ComponentProps<"div"> {
  /**
   * Change the default rendered element for the one passed as a child
   */
  asChild?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export interface SidebarGroupActionProps
  extends React.ComponentProps<"button"> {
  children?: React.ReactNode;
  className?: string;
  title?: string;
}

export interface SidebarGroupContentProps extends React.ComponentProps<"div"> {
  children?: React.ReactNode;
  className?: string;
}

// ============================================================================
// Menu Component Types
// ============================================================================

export interface SidebarMenuProps extends React.ComponentProps<"ul"> {
  children?: React.ReactNode;
  className?: string;
}

export interface SidebarMenuItemProps extends React.ComponentProps<"li"> {
  children?: React.ReactNode;
  className?: string;
}

export interface SidebarMenuButtonProps extends React.ComponentProps<"button"> {
  /**
   * Change the default rendered element for the one passed as a child
   */
  asChild?: boolean;

  /**
   * Whether this menu item is active
   */
  isActive?: boolean;

  /**
   * Tooltip text when sidebar is collapsed
   */
  tooltip?: string | React.ComponentProps<"div">;

  children?: React.ReactNode;
  className?: string;
}

export interface SidebarMenuActionProps extends React.ComponentProps<"button"> {
  /**
   * Change the default rendered element for the one passed as a child
   */
  asChild?: boolean;

  /**
   * Show the action on hover only
   */
  showOnHover?: boolean;

  children?: React.ReactNode;
  className?: string;
}

export interface SidebarMenuSubProps extends React.ComponentProps<"ul"> {
  children?: React.ReactNode;
  className?: string;
}

export interface SidebarMenuSubItemProps extends React.ComponentProps<"li"> {
  children?: React.ReactNode;
  className?: string;
}

export interface SidebarMenuSubButtonProps extends React.ComponentProps<"a"> {
  /**
   * Change the default rendered element for the one passed as a child
   */
  asChild?: boolean;

  /**
   * Whether this sub-menu item is active
   */
  isActive?: boolean;

  children?: React.ReactNode;
  className?: string;
}

export interface SidebarMenuBadgeProps extends React.ComponentProps<"div"> {
  children?: React.ReactNode;
  className?: string;
}

export interface SidebarMenuSkeletonProps extends React.ComponentProps<"div"> {
  /**
   * Show the icon skeleton
   */
  showIcon?: boolean;

  className?: string;
}

// ============================================================================
// Separator & Trigger Types
// ============================================================================

export interface SidebarSeparatorProps extends React.ComponentProps<"hr"> {
  className?: string;
}

export interface SidebarTriggerProps extends React.ComponentProps<"button"> {
  children?: React.ReactNode;
  className?: string;
}

// ============================================================================
// Component Declarations
// ============================================================================

export declare const SidebarProvider: React.FC<SidebarProviderProps>;

export declare const Sidebar: React.ForwardRefExoticComponent<
  SidebarProps & React.RefAttributes<HTMLDivElement>
>;

export declare const SidebarHeader: React.FC<SidebarHeaderProps>;
export declare const SidebarFooter: React.FC<SidebarFooterProps>;
export declare const SidebarContent: React.FC<SidebarContentProps>;
export declare const SidebarInset: React.FC<SidebarInsetProps>;
export declare const SidebarRail: React.FC<SidebarRailProps>;

export declare const SidebarGroup: React.FC<SidebarGroupProps>;
export declare const SidebarGroupLabel: React.ForwardRefExoticComponent<
  SidebarGroupLabelProps & React.RefAttributes<HTMLDivElement>
>;
export declare const SidebarGroupAction: React.ForwardRefExoticComponent<
  SidebarGroupActionProps & React.RefAttributes<HTMLButtonElement>
>;
export declare const SidebarGroupContent: React.FC<SidebarGroupContentProps>;

export declare const SidebarMenu: React.FC<SidebarMenuProps>;
export declare const SidebarMenuItem: React.FC<SidebarMenuItemProps>;
export declare const SidebarMenuButton: React.ForwardRefExoticComponent<
  SidebarMenuButtonProps & React.RefAttributes<HTMLButtonElement>
>;
export declare const SidebarMenuAction: React.ForwardRefExoticComponent<
  SidebarMenuActionProps & React.RefAttributes<HTMLButtonElement>
>;

export declare const SidebarMenuSub: React.FC<SidebarMenuSubProps>;
export declare const SidebarMenuSubItem: React.FC<SidebarMenuSubItemProps>;
export declare const SidebarMenuSubButton: React.ForwardRefExoticComponent<
  SidebarMenuSubButtonProps & React.RefAttributes<HTMLAnchorElement>
>;

export declare const SidebarMenuBadge: React.FC<SidebarMenuBadgeProps>;
export declare const SidebarMenuSkeleton: React.FC<SidebarMenuSkeletonProps>;

export declare const SidebarSeparator: React.ForwardRefExoticComponent<
  SidebarSeparatorProps & React.RefAttributes<HTMLHRElement>
>;
export declare const SidebarTrigger: React.FC<SidebarTriggerProps>;

// ============================================================================
// Hook Declaration
// ============================================================================

/**
 * Hook to access sidebar state and controls
 * Must be used within a SidebarProvider
 */
export declare function useSidebar(): UseSidebarReturn;

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Menu item data structure
 */
export interface SidebarMenuItem {
  title: string;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  badge?: string | number;
  items?: SidebarMenuSubItem[];
}

/**
 * Sub-menu item data structure
 */
export interface SidebarMenuSubItem {
  title: string;
  url: string;
  isActive?: boolean;
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
