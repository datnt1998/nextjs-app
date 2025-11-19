"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { SidebarItemProps } from "./sidebar.types";

export function SidebarItem({ item, collapsed, isActive }: SidebarItemProps) {
  const Icon = item.icon;

  const buttonContent = (
    <Button
      variant="ghost"
      className={cn(
        "w-full transition-all duration-200",
        collapsed
          ? "h-11 w-11 p-0 justify-center"
          : "h-11 justify-start gap-3 px-3",
        isActive
          ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
          : "hover:bg-accent hover:text-accent-foreground"
      )}
      asChild
    >
      <Link href={item.href}>
        <Icon
          className={cn(
            "shrink-0 transition-colors",
            collapsed ? "h-5 w-5" : "h-5 w-5",
            isActive ? "text-primary-foreground" : ""
          )}
        />
        {!collapsed && (
          <motion.span
            initial={false}
            animate={{
              opacity: 1,
              width: "auto",
            }}
            exit={{
              opacity: 0,
              width: 0,
            }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden whitespace-nowrap font-medium"
          >
            {item.label}
          </motion.span>
        )}
      </Link>
    </Button>
  );

  if (collapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {item.label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return buttonContent;
}
