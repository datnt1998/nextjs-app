import type { Icons } from "@/components/icons/registry";
import type { Locale } from "@/i18n/config";
import type { Permission } from "@/lib/rbac/permissions";

export type SiteConfig = typeof siteConfig;

/**
 * Base navigation item with all common properties
 */
export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  badge?: string | number;
  /**
   * Translation key for the item title
   * e.g., "main.dashboard" will use navigation.main.dashboard from translations
   */
  translationKey?: string;
  /**
   * Required permissions to view this item.
   * User must have at least one of these permissions.
   * If not specified, item is visible to all authenticated users.
   */
  permissions?: Permission[];
  items?: NavItem[]; // Sub-navigation items
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

/**
 * Navigation group for organizing sidebar items
 */
export interface SidebarNavGroup {
  title: string;
  /**
   * Translation key for the group title
   * e.g., "groups.main" will use navigation.groups.main from translations
   */
  translationKey?: string;
  items: NavItem[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

/**
 * Navigation group containing multiple items
 */
export type NavGroup = {
  title: string;
  items: NavItem[];
};

/**
 * Complete sidebar data structure
 */
export type SidebarData = {
  navGroups: NavGroup[];
};

// Locale-specific site metadata
export interface LocaleSiteMetadata {
  name: string;
  description: string;
  keywords: string[];
}

// Base site configuration (locale-independent)
export const siteConfig = {
  url: "https://nextjs-starter-kit.vercel.app",
  ogImage: "https://nextjs-starter-kit.vercel.app/og.jpg",
  links: {
    twitter: "https://twitter.com/yourusername",
    github: "https://github.com/yourusername/nextjs-starter-kit",
  },
  creator: {
    name: "Your Name",
    url: "https://yourwebsite.com",
  },
  authors: [
    {
      name: "Your Name",
      url: "https://yourwebsite.com",
    },
  ] as Array<{ name: string; url: string }>,
  // Locale-specific metadata
  localeMetadata: {
    en: {
      name: "NextJS Starter Kit",
      description:
        "A modern, lightweight, and highly extensible NextJS starter kit optimized for SaaS dashboards and management systems.",
      keywords: [
        "Next.js",
        "React",
        "Tailwind CSS",
        "TypeScript",
        "Supabase",
        "SaaS",
        "Dashboard",
        "Starter Kit",
      ],
    },
    vi: {
      name: "Bộ công cụ khởi động NextJS",
      description:
        "Bộ công cụ khởi động NextJS hiện đại, nhẹ và có khả năng mở rộng cao được tối ưu hóa cho bảng điều khiển SaaS và hệ thống quản lý.",
      keywords: [
        "Next.js",
        "React",
        "Tailwind CSS",
        "TypeScript",
        "Supabase",
        "SaaS",
        "Bảng điều khiển",
        "Bộ công cụ khởi động",
      ],
    },
  } as Record<Locale, LocaleSiteMetadata>,
  // Navigation groups for organized sidebar
  dashboardNavGroups: [
    {
      title: "Main",
      translationKey: "groups.main",
      items: [
        {
          title: "Dashboard",
          translationKey: "main.dashboard",
          href: "/dashboard",
          icon: "home",
          // No permissions required - visible to all authenticated users
        },
        {
          title: "Users",
          translationKey: "main.users",
          href: "/dashboard/users",
          icon: "users",
          permissions: ["users:view"],
        },
        {
          title: "Items",
          translationKey: "main.items",
          href: "/dashboard/items",
          icon: "folder",
          permissions: ["items:view"],
          items: [
            {
              title: "Table View",
              translationKey: "items.tableView",
              href: "/dashboard/items/table",
              permissions: ["items:view"],
            },
            {
              title: "Create New",
              translationKey: "items.createNew",
              href: "/dashboard/items/new",
              permissions: ["items:create"],
            },
          ],
        },
      ],
    },
    {
      title: "Tools",
      translationKey: "groups.tools",
      items: [
        {
          title: "DataTable",
          translationKey: "main.dataTable",
          href: "/dashboard/table",
          icon: "grid",
          // Demo page - no permissions required
        },
        {
          title: "Components",
          translationKey: "main.components",
          href: "/dashboard/components",
          icon: "grid",
          // Demo page - no permissions required
        },
        {
          title: "Upload",
          translationKey: "main.upload",
          href: "/dashboard/upload",
          icon: "upload",
          permissions: ["items:create"],
        },
      ],
    },
    {
      title: "Settings",
      translationKey: "groups.settings",
      items: [
        {
          title: "Settings",
          translationKey: "main.settings",
          href: "/dashboard/settings",
          icon: "settings",
          permissions: ["settings:view"],
        },
      ],
    },
  ] satisfies SidebarNavGroup[],
  // Flat navigation for backward compatibility
  dashboardNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "home",
    },
    {
      title: "Users",
      href: "/dashboard/users",
      icon: "users",
      permissions: ["users:view"],
    },
    {
      title: "Items",
      href: "/dashboard/items",
      icon: "folder",
      permissions: ["items:view"],
      items: [
        {
          title: "Grid View",
          href: "/dashboard/items",
          permissions: ["items:view"],
        },
        {
          title: "Table View",
          href: "/dashboard/items/table",
          permissions: ["items:view"],
        },
        {
          title: "Create New",
          href: "/dashboard/items/new",
          permissions: ["items:create"],
        },
      ],
    },
    {
      title: "DataTable",
      href: "/dashboard/table",
      icon: "grid",
    },
    {
      title: "Components",
      href: "/dashboard/components",
      icon: "grid",
    },
    {
      title: "Upload",
      href: "/dashboard/upload",
      icon: "upload",
      permissions: ["items:create"],
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
      permissions: ["settings:view"],
    },
  ] satisfies NavItem[],
  secondaryNav: [
    {
      title: "Documentation",
      translationKey: "secondary.documentation",
      href: "/docs",
      icon: "folder",
    },
    {
      title: "Support",
      translationKey: "secondary.support",
      href: "/support",
      icon: "search",
    },
  ] satisfies NavItem[],
  projects: [
    {
      name: "Main Workspace",
      url: "#",
      icon: "home",
    },
    {
      name: "Team Alpha",
      url: "#",
      icon: "users",
    },
    {
      name: "Team Beta",
      url: "#",
      icon: "users",
    },
  ] as const,
} as const;

/**
 * Get locale-specific site metadata
 * @param locale - The locale to get metadata for
 * @returns Locale-specific site name, description, and keywords
 */
export function getLocaleSiteConfig(locale: Locale): LocaleSiteMetadata {
  return siteConfig.localeMetadata[locale];
}

/**
 * Get the site name for a specific locale
 * @param locale - The locale to get the site name for
 * @returns Localized site name
 */
export function getSiteName(locale: Locale): string {
  return siteConfig.localeMetadata[locale].name;
}

/**
 * Get the site description for a specific locale
 * @param locale - The locale to get the site description for
 * @returns Localized site description
 */
export function getSiteDescription(locale: Locale): string {
  return siteConfig.localeMetadata[locale].description;
}

/**
 * Get the site keywords for a specific locale
 * @param locale - The locale to get the site keywords for
 * @returns Localized site keywords
 */
export function getSiteKeywords(locale: Locale): string[] {
  return siteConfig.localeMetadata[locale].keywords;
}
