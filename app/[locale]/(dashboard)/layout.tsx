"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { TopNav } from "@/components/dashboard/top-nav";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NuqsAdapter>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />

        {/* Main Content Area */}
        <SidebarInset>
          {/* Top Navigation with Sidebar Trigger and Theme Switcher */}
          <TopNav />

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </NuqsAdapter>
  );
}
