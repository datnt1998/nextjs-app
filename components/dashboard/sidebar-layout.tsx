"use client";

import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/stores/sidebar.store";

interface SidebarLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export const SidebarLayout = ({ sidebar, children }: SidebarLayoutProps) => {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="flex h-screen overflow-hidden">
      <aside
        className={cn(
          "shrink-0 overflow-y-auto border-r border-border bg-sidebar-bg transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {sidebar}
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};
