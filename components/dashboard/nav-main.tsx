"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/icons/registry";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import type { NavItem } from "@/config/site";
import type { Permission } from "@/lib/rbac/permissions";
import { hasPermission } from "@/lib/rbac/permissions";
import { useUserStore } from "@/stores/user.store";

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const user = useUserStore((s) => s.user);

  // Helper to check if a route is active (for parent items with children)
  // Uses prefix matching to keep parent highlighted when on any child route
  const isActive = (href: string) => {
    if (pathname === href) {
      return true;
    }
    // For sub-routes, check if pathname starts with href followed by /
    return pathname.startsWith(href + "/");
  };

  // Helper to check if a specific sub-item is active (exact match only)
  // This prevents /dashboard/items from being active when on /dashboard/items/new
  const isSubItemActive = (href: string) => {
    return pathname === href;
  };

  // Helper to check if user has permission to view item
  const canViewItem = (item: NavItem) => {
    // If no permissions required, item is visible to all
    if (!item.permissions || item.permissions.length === 0) {
      return true;
    }

    // Check if user has at least one of the required permissions
    if (!user) return false;

    const userProfile = {
      id: user.id,
      role: user.role,
      permissions: user.permissions || [],
      tenant_id: user.tenant_id || "",
    };

    return item.permissions.some((permission) =>
      hasPermission(userProfile, permission as Permission)
    );
  };

  // Filter items based on permissions
  const visibleItems = items.filter(canViewItem);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {visibleItems.map((item) => {
          const Icon = item.icon ? Icons[item.icon] : Icons.folder;
          const hasSubItems = item.items && item.items.length > 0;
          const active = isActive(item.href);

          // Filter sub-items based on permissions
          const visibleSubItems =
            hasSubItems && item.items ? item.items.filter(canViewItem) : [];

          if (hasSubItems && visibleSubItems.length > 0) {
            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={active}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title} isActive={active}>
                      <Icon className="size-4" />
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {visibleSubItems.map((subItem) => {
                        const subActive = isSubItemActive(subItem.href);
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild isActive={subActive}>
                              <Link href={subItem.href}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title} isActive={active}>
                <Link href={item.href}>
                  <Icon className="size-4" />
                  <span>{item.title}</span>
                  {item.badge && (
                    <span className="ml-auto inline-flex items-center justify-center rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
