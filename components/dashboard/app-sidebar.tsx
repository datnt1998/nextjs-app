"use client";

import { useTranslations } from "next-intl";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site";
import type { NavItem } from "@/config/site";
import { Icons } from "@/components/icons/registry";
import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import type { Permission } from "@/lib/rbac/permissions";
import { hasPermission } from "@/lib/rbac/permissions";
import { useUserStore } from "@/stores/user.store";
import { isPathnameActive } from "@/lib/navigation/utils";
import { NavGroup } from "./nav-group";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";

export function AppSidebar() {
  const t = useTranslations("navigation");
  const pathname = usePathname();
  const user = useUserStore((s) => s.user);
  const { setOpenMobile } = useSidebar();

  // Helper to check if user has permission to view item
  const canViewItem = (item: NavItem): boolean => {
    if (!item.permissions || item.permissions.length === 0) {
      return true;
    }

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

  // Helper to check if a route is active
  const isActive = (href: string): boolean => {
    return isPathnameActive(pathname, href, false);
  };

  // Filter secondary navigation items
  const visibleSecondaryItems = siteConfig.secondaryNav.filter(canViewItem);

  return (
    <Sidebar variant="floating" collapsible="icon">
      {/* Header with Workspace/Project Switcher */}
      <SidebarHeader>
        <NavProjects projects={siteConfig.projects} />
      </SidebarHeader>

      {/* Main Navigation Content */}
      <SidebarContent>
        {/* Primary Navigation Groups with permission-based filtering */}
        {siteConfig.dashboardNavGroups.map((group) => (
          <NavGroup
            key={group.title}
            title={group.translationKey ? t(group.translationKey) : group.title}
            items={group.items}
          />
        ))}

        {/* Secondary Navigation (Help & Support) */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleSecondaryItems.map((item: NavItem) => {
                const Icon = item.icon ? Icons[item.icon] : Icons.folder;
                const active = isActive(item.href);
                const itemTitle = item.translationKey
                  ? t(item.translationKey)
                  : item.title;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      size="sm"
                      onClick={() => setOpenMobile(false)}
                    >
                      <Link href={item.href}>
                        <Icon className="size-4" />
                        <span>{itemTitle}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with User Menu */}
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      {/* Rail for toggle functionality */}
      <SidebarRail />
    </Sidebar>
  );
}
