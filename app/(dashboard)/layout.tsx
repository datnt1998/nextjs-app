"use client";

import { useMemo } from "react";
import { UserMenu } from "@/components/dashboard/user-menu";
import { Icons } from "@/components/icons/registry";
import { Sidebar } from "@/components/shared/sidebar";
import type { SidebarItem } from "@/components/shared/sidebar/sidebar.types";
import { siteConfig } from "@/config/site";
import { useSidebarStore } from "@/stores/sidebar.store";
import { useUserStore } from "@/stores/user.store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCollapsed, setCollapsed } = useSidebarStore();
  const role = useUserStore((s) => s.role);

  // Convert dashboard nav items to sidebar items with RBAC filtering
  const items = useMemo<SidebarItem[]>(() => {
    return siteConfig.dashboardNav
      .filter((item) => (item.roles as readonly string[]).includes(role))
      .map((item) => ({
        label: item.title,
        icon: item.icon ? Icons[item.icon] : Icons.folder,
        href: item.href,
      }));
  }, [role]);

  // Bottom items (profile, logout, etc.)
  const bottomItems = useMemo<SidebarItem[]>(() => {
    return [
      {
        label: "Profile",
        icon: Icons.user,
        href: "/profile",
      },
      {
        label: "Logout",
        icon: Icons.logout,
        href: "/logout",
      },
    ];
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        variant="floating"
        items={items}
        bottomItems={bottomItems}
        collapsed={isCollapsed}
        onToggle={() => setCollapsed(!isCollapsed)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header with UserMenu */}
        <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background px-6">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <UserMenu />
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
