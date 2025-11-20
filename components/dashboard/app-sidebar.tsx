"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";

export function AppSidebar() {
  return (
    <Sidebar variant="floating" collapsible="icon">
      {/* Header with Workspace/Project Switcher */}
      <SidebarHeader>
        <NavProjects projects={siteConfig.projects} />
      </SidebarHeader>

      {/* Main Navigation Content */}
      <SidebarContent>
        {/* Primary Navigation with permission-based filtering */}
        <NavMain items={siteConfig.dashboardNav} />

        {/* Secondary Navigation (Help & Support) */}
        <NavSecondary items={siteConfig.secondaryNav} />
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
