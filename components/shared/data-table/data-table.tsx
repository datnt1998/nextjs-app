"use client";

import type { Table as TanStackTable } from "@tanstack/react-table";
import { type ColumnDef, flexRender } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DENSITY_CLASSES, type TableDensity } from "@/types/density";

interface DataTableProps<TData, TValue> {
  /**
   * The table instance from useDataTable hook
   */
  table: TanStackTable<TData>;
  /**
   * Column definitions
   */
  columns: ColumnDef<TData, TValue>[];
  /**
   * Custom className for the table container
   */
  className?: string;
  /**
   * Loading state
   */
  isLoading?: boolean;
  /**
   * Empty state message
   */
  emptyMessage?: string;
  /**
   * Show table border
   */
  bordered?: boolean;
  /**
   * Table density (spacing)
   */
  density?: TableDensity;
}

export function DataTable<TData, TValue>({
  table,
  columns,
  className,
  isLoading = false,
  emptyMessage = "No results found.",
  bordered = true,
  density = "comfortable",
}: DataTableProps<TData, TValue>) {
  const densityClass = DENSITY_CLASSES[density];
  return (
    <div className={cn("w-full space-y-4", className)}>
      <div className={cn("rounded-md", bordered && "border")}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      densityClass,
                      header.column.getCanSort() &&
                        "cursor-pointer select-none",
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={densityClass}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <p className="text-sm text-muted-foreground">
                    {emptyMessage}
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
