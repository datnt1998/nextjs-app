"use client";

import type { Table } from "@tanstack/react-table";
import { Check, Settings2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { DENSITY_OPTIONS, type TableDensity } from "@/types/density";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  density?: TableDensity;
  onDensityChange?: (density: TableDensity) => void;
}

export function DataTableViewOptions<TData>({
  table,
  density = "comfortable",
  onDensityChange,
}: DataTableViewOptionsProps<TData>) {
  const t = useTranslations("table.viewOptions");
  const tDensity = useTranslations("table.density");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <Settings2 className="mr-2 h-4 w-4" />
          {t("view")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {/* Density Options */}
        {onDensityChange && (
          <>
            <DropdownMenuLabel>{t("density")}</DropdownMenuLabel>
            {DENSITY_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onDensityChange(option.value)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    density === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span className="text-sm">{tDensity(option.value)}</span>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </>
        )}

        {/* Column Visibility */}
        <DropdownMenuLabel>{t("toggleColumns")}</DropdownMenuLabel>
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
