import type { Icons } from "@/components/icons/registry";
import type { Role } from "@/stores/user.store";

export type SiteConfig = typeof siteConfig;

export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
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

export const siteConfig = {
  name: "NextJS Starter Kit",
  description:
    "A modern, lightweight, and highly extensible NextJS starter kit optimized for SaaS dashboards and management systems.",
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
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "TypeScript",
    "Supabase",
    "SaaS",
    "Dashboard",
    "Starter Kit",
  ] as string[],
  authors: [
    {
      name: "Your Name",
      url: "https://yourwebsite.com",
    },
  ] as Array<{ name: string; url: string }>,
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
      roles: ["owner", "admin", "manager", "editor", "viewer"],
    },
    {
      title: "Users",
      href: "/dashboard/users",
      icon: "users",
      roles: ["owner", "admin"],
    },
    {
      title: "Items",
      href: "/dashboard/items",
      icon: "folder",
      roles: ["owner", "admin", "manager", "editor"],
    },
    {
      title: "DataTable Examples",
      href: "/dashboard/examples/data-table",
      icon: "grid",
      roles: [],
    },
    {
      title: "Components",
      href: "/dashboard/components",
      icon: "grid",
      roles: ["owner", "admin", "manager", "editor", "viewer"],
    },
    {
      title: "Upload",
      href: "/dashboard/upload",
      icon: "upload",
      roles: ["owner", "admin", "manager", "editor"],
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
      roles: ["owner", "admin"],
    },
  ] satisfies Array<NavItem & { roles: Role[] }>,
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
