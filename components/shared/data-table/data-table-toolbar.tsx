"use client";

import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TableDensity } from "@/types/density";
import type { DataTableFilterField } from "@/types/table";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterFields?: DataTableFilterField<TData>[];
  children?: React.ReactNode;
  density?: TableDensity;
  onDensityChange?: (density: TableDensity) => void;
}

export function DataTableToolbar<TData>({
  table,
  filterFields,
  children,
  density,
  onDensityChange,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // Get the first input filter field for the search bar
  const searchField = filterFields?.find((field) => field.type === "input");

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {searchField && (
          <Input
            placeholder={
              searchField.placeholder ||
              `Search ${searchField.label.toLowerCase()}...`
            }
            value={
              (table.getColumn(searchField.id)?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn(searchField.id)
                ?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
        {children}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions
        table={table}
        density={density}
        onDensityChange={onDensityChange}
      />
    </div>
  );
}
