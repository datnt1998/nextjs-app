import type { Icons } from "@/components/icons/registry";
import type { Locale } from "@/i18n/config";

export type SiteConfig = typeof siteConfig;

export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  badge?: string | number;
  permissions?: string[]; // Required permissions to view this item
  items?: NavItem[]; // Sub-navigation items
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
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
  mainNav: [
    {
      title: "Features",
      href: "/#features",
    },
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "Dashboard",
      href: "/dashboard",
    },
  ] satisfies MainNavItem[],
  dashboardNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "home",
      // No permissions required - visible to all authenticated users
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
      // Demo page - no permissions required
    },
    {
      title: "Components",
      href: "/dashboard/components",
      icon: "grid",
      // Demo page - no permissions required
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
      href: "/docs",
      icon: "folder",
    },
    {
      title: "Support",
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
  footerNav: [
    {
      title: "Product",
      items: [
        {
          title: "Features",
          href: "/#features",
          external: false,
        },
        {
          title: "Pricing",
          href: "/pricing",
          external: false,
        },
        {
          title: "Changelog",
          href: "/changelog",
          external: false,
        },
      ],
    },
    {
      title: "Resources",
      items: [
        {
          title: "Documentation",
          href: "/docs",
          external: false,
        },
        {
          title: "Blog",
          href: "/blog",
          external: false,
        },
        {
          title: "Support",
          href: "/support",
          external: false,
        },
      ],
    },
    {
      title: "Company",
      items: [
        {
          title: "About",
          href: "/about",
          external: false,
        },
        {
          title: "Contact",
          href: "/contact",
          external: false,
        },
        {
          title: "Privacy",
          href: "/privacy",
          external: false,
        },
        {
          title: "Terms",
          href: "/terms",
          external: false,
        },
      ],
    },
    {
      title: "Community",
      items: [
        {
          title: "GitHub",
          href: "https://github.com/yourusername/nextjs-starter-kit",
          external: true,
        },
        {
          title: "Twitter",
          href: "https://twitter.com/yourusername",
          external: true,
        },
        {
          title: "Discord",
          href: "https://discord.gg/yourinvite",
          external: true,
        },
      ],
    },
  ] satisfies FooterItem[],
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
