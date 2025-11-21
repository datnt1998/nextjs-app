"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

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
          {/* Header with Trigger */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-6">
            <SidebarTrigger />
            <div className="flex-1" />
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </NuqsAdapter>
  );
}
