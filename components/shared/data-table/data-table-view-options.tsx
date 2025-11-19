"use client";

import type { Table } from "@tanstack/react-table";
import {
  ColumnsIcon,
  ListIcon,
  SquareIcon,
  StretchHorizontalIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTableStore } from "@/stores/table.store";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  showDensityControl?: boolean;
  showColumnVisibility?: boolean;
}

export function DataTableViewOptions<TData>({
  table,
  showDensityControl = true,
  showColumnVisibility = true,
}: DataTableViewOptionsProps<TData>) {
  const density = useTableStore((state) => state.density);
  const setDensity = useTableStore((state) => state.setDensity);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <ColumnsIcon className="size-4" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {showDensityControl && (
          <>
            <DropdownMenuLabel>Density</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={density}
              onValueChange={(value) =>
                setDensity(value as "compact" | "comfortable" | "spacious")
              }
            >
              <DropdownMenuRadioItem value="compact">
                <ListIcon className="size-4" />
                Compact
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="comfortable">
                <SquareIcon className="size-4" />
                Comfortable
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="spacious">
                <StretchHorizontalIcon className="size-4" />
                Spacious
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </>
        )}

        {showDensityControl && showColumnVisibility && (
          <DropdownMenuSeparator />
        )}

        {showColumnVisibility && (
          <>
            <DropdownMenuLabel>Columns</DropdownMenuLabel>
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== "undefined" &&
                  column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
