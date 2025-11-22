"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Icons } from "@/components/icons/registry";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { NavItem } from "@/config/site";

export function NavSecondary({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const t = useTranslations("navigation");

  // Helper to translate navigation item titles
  const translateTitle = (title: string): string => {
    const titleMap: Record<string, string> = {
      Documentation: t("secondary.documentation"),
      Support: t("secondary.support"),
    };
    return titleMap[title] || title;
  };

  // Helper to check if a route is active
  const isActive = (href: string) => {
    // Exact match
    if (pathname === href) {
      return true;
    }
    // Check if pathname starts with href followed by /
    // This prevents /support from matching /support-center
    return pathname.startsWith(`${href}/`);
  };

  return (
    <SidebarGroup className="mt-auto">
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const Icon = item.icon ? Icons[item.icon] : Icons.folder;
            const active = isActive(item.href);

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={active} size="sm">
                  <Link href={item.href}>
                    <Icon className="size-4" />
                    <span>{translateTitle(item.title)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
