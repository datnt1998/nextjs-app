"use client";

/**
 * Example usage of the Sidebar component
 * This file demonstrates various ways to use the sidebar
 */

import {
  FileText,
  Home,
  LogOut,
  Settings,
  Upload,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Sidebar } from "./sidebar";

// Basic Example with Flat Variant
export function FlatSidebarExample() {
  const [collapsed, setCollapsed] = useState(false);

  const items = [
    { label: "Dashboard", icon: Home, href: "/dashboard" },
    { label: "Users", icon: Users, href: "/dashboard/users" },
    { label: "Items", icon: FileText, href: "/dashboard/items" },
    { label: "Upload", icon: Upload, href: "/dashboard/upload" },
    { label: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  const bottomItems = [
    { label: "Profile", icon: User, href: "/profile" },
    { label: "Logout", icon: LogOut, href: "/logout" },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar
        items={items}
        bottomItems={bottomItems}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        variant="flat"
      />
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-2xl font-bold">Flat Sidebar</h1>
        <p className="text-muted-foreground">
          Full-height sidebar with no shadow or rounded corners
        </p>
      </main>
    </div>
  );
}

// Floating Variant Example
export function FloatingSidebarExample() {
  const [collapsed, setCollapsed] = useState(false);

  const items = [
    { label: "Dashboard", icon: Home, href: "/dashboard" },
    { label: "Users", icon: Users, href: "/dashboard/users" },
    { label: "Items", icon: FileText, href: "/dashboard/items" },
    { label: "Upload", icon: Upload, href: "/dashboard/upload" },
    { label: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  const bottomItems = [
    { label: "Profile", icon: User, href: "/profile" },
    { label: "Logout", icon: LogOut, href: "/logout" },
  ];

  return (
    <div className="flex h-screen bg-muted/30">
      <Sidebar
        items={items}
        bottomItems={bottomItems}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        variant="floating"
      />
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-2xl font-bold">Floating Sidebar</h1>
        <p className="text-muted-foreground">
          Elevated sidebar with rounded corners and subtle shadow
        </p>
      </main>
    </div>
  );
}

// With RBAC Filtering Example
export function RBACFilteredSidebarExample() {
  const [collapsed, setCollapsed] = useState(false);

  // Simulated user role - in real app, get from auth context/store
  const userRole = "editor"; // Could be: owner, admin, manager, editor, viewer

  const allItems = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
      roles: ["owner", "admin", "manager", "editor", "viewer"],
    },
    {
      label: "Users",
      icon: Users,
      href: "/dashboard/users",
      roles: ["owner", "admin"],
    },
    {
      label: "Items",
      icon: FileText,
      href: "/dashboard/items",
      roles: ["owner", "admin", "manager", "editor"],
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      roles: ["owner", "admin"],
    },
  ];

  // Filter items based on user role
  const items = allItems.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  const bottomItems = [
    { label: "Profile", icon: User, href: "/profile" },
    { label: "Logout", icon: LogOut, href: "/logout" },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar
        items={items}
        bottomItems={bottomItems}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        variant="flat"
      />
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-2xl font-bold">RBAC Filtered Sidebar</h1>
        <p className="text-muted-foreground">
          Current role: <strong>{userRole}</strong>
        </p>
        <p className="text-muted-foreground">
          You can only see menu items allowed for your role
        </p>
      </main>
    </div>
  );
}

// Collapsed by Default Example
export function CollapsedSidebarExample() {
  const [collapsed, setCollapsed] = useState(true);

  const items = [
    { label: "Dashboard", icon: Home, href: "/dashboard" },
    { label: "Users", icon: Users, href: "/dashboard/users" },
    { label: "Items", icon: FileText, href: "/dashboard/items" },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar
        items={items}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        variant="flat"
      />
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-2xl font-bold">Collapsed Sidebar</h1>
        <p className="text-muted-foreground">
          Sidebar starts collapsed with tooltips on hover
        </p>
      </main>
    </div>
  );
}
