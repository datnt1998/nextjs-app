"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/icons/registry";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/stores/sidebar.store";
import { useUserStore } from "@/stores/user.store";

export interface MenuItem {
  label: string;
  href: string;
  icon: keyof typeof Icons;
  roles: Array<"owner" | "admin" | "manager" | "editor" | "viewer">;
}

const sidebarMenu: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "home",
    roles: ["owner", "admin", "manager", "editor", "viewer"],
  },
  {
    label: "Users",
    href: "/dashboard/users",
    icon: "users",
    roles: ["owner", "admin"],
  },
  {
    label: "Items",
    href: "/dashboard/items",
    icon: "folder",
    roles: ["owner", "admin", "manager", "editor"],
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: "settings",
    roles: ["owner", "admin"],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, setCollapsed } = useSidebarStore();
  const role = useUserStore((s) => s.role);

  // Filter menu items based on user role
  const filteredMenu = sidebarMenu.filter((item) => item.roles.includes(role));

  return (
    <div className="flex h-full flex-col bg-sidebar-bg text-sidebar-fg">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold">NextJS Starter</h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!isCollapsed)}
          className="ml-auto"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <Icons.chevronRight className="h-5 w-5" />
          ) : (
            <Icons.chevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {filteredMenu.map((item) => {
          const Icon = Icons[item.icon];
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                "hover:bg-sidebar-hover",
                isActive ? "bg-sidebar-active text-white" : "text-sidebar-fg",
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
