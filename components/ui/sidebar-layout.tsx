interface SidebarLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export const SidebarLayout = ({ sidebar, children }: SidebarLayoutProps) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 shrink-0 overflow-y-auto border-r border-border bg-sidebar-bg">
        {sidebar}
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};
