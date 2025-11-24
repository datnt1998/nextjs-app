"use client";

import type { Column } from "@tanstack/react-table";
import { ChevronDown, ChevronUp } from "lucide-react";
import type * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.ComponentProps<typeof Button> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        column.toggleSorting(undefined);
      }}
      className={cn(
        "flex h-7 w-full items-center justify-between gap-2 px-0 py hover:bg-transparent text-xs font-medium text-body-foreground",
        className
      )}
      {...props}
    >
      <span>{title}</span>
      <span className="flex flex-col">
        <ChevronUp
          className={cn(
            "-mb-0.5 h-1 w-1",
            column.getIsSorted() === "asc"
              ? "text-accent-foreground"
              : "text-muted-foreground/40"
          )}
        />
        <ChevronDown
          className={cn(
            "-mt-0.5 h-1 w-1",
            column.getIsSorted() === "desc"
              ? "text-accent-foreground"
              : "text-muted-foreground/40"
          )}
        />
      </span>
    </Button>
  );
}
