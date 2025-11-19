"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { SidebarProps } from "./sidebar.types";
import { SidebarItem } from "./sidebar-item";

export function Sidebar({
  items,
  bottomItems = [],
  collapsed,
  onToggle,
  variant = "flat",
  className,
}: SidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Header with toggle */}
      <div
        className={cn(
          "flex items-center",
          collapsed ? "py-3 justify-center" : "justify-between p-4"
        )}
      >
        <motion.div
          initial={false}
          animate={{
            opacity: collapsed ? 0 : 1,
            width: collapsed ? 0 : "auto",
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="overflow-hidden whitespace-nowrap text-lg font-semibold"
        >
          Dashboard
        </motion.div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn("shrink-0", collapsed && "h-9 w-9")}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      <Separator />

      {/* Main navigation */}
      <ScrollArea className="flex-1">
        <nav
          className={cn(collapsed ? "space-y-1 px-2.5 py-3" : "space-y-1 p-3")}
        >
          {items.map((item) => (
            <SidebarItem
              key={item.href}
              item={item}
              collapsed={collapsed}
              isActive={isActive(item.href)}
            />
          ))}
        </nav>
      </ScrollArea>

      {/* Bottom items */}
      {bottomItems.length > 0 && (
        <>
          <Separator />
          <div
            className={cn(
              collapsed ? "space-y-1 px-2.5 py-3" : "space-y-1 p-3"
            )}
          >
            {bottomItems.map((item) => (
              <SidebarItem
                key={item.href}
                item={item}
                collapsed={collapsed}
                isActive={isActive(item.href)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile: Hamburger + Sheet */}
      <div className="lg:hidden">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed left-4 top-4 z-40"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
            {sidebarContent}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: Animated sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: collapsed ? 72 : 240,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "hidden lg:flex shrink-0 flex-col border-r border-border bg-card",
          variant === "floating" && "m-4 rounded-lg shadow-lg border-border/50",
          className
        )}
      >
        {sidebarContent}
      </motion.aside>
    </>
  );
}
