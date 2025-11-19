import { Sidebar } from "@/components/dashboard/sidebar";
import { SidebarLayout } from "@/components/dashboard/sidebar-layout";
import { UserMenu } from "@/components/dashboard/user-menu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarLayout sidebar={<Sidebar />}>
      {/* Header with UserMenu */}
      <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background px-6">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <UserMenu />
      </div>

      {/* Main content */}
      <div className="p-6">{children}</div>
    </SidebarLayout>
  );
}
