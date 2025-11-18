"use client";

import {
  type ColumnDef,
  type ColumnResizeMode,
  flexRender,
  getCoreRowModel,
  type OnChangeFn,
  type RowSelectionState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { useTableStore } from "@/stores/table.store";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  enableRowSelection?: boolean;
  enableColumnResizing?: boolean;
  enableStickyHeader?: boolean;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  rowSelection?: RowSelectionState;
  manualPagination?: boolean;
  pageCount?: number;
  manualSorting?: boolean;
  onSortingChange?: OnChangeFn<SortingState>;
  sorting?: SortingState;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  enableRowSelection = false,
  enableColumnResizing = false,
  enableStickyHeader = false,
  onRowSelectionChange,
  rowSelection = {},
  manualPagination = false,
  pageCount,
  manualSorting = false,
  onSortingChange,
  sorting = [],
}: DataTableProps<TData, TValue>) {
  const density = useTableStore((state) => state.density);

  const columnResizeMode: ColumnResizeMode = "onChange";

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection,
    enableColumnResizing,
    columnResizeMode,
    onRowSelectionChange,
    state: {
      rowSelection,
      ...(manualSorting && { sorting }),
    },
    manualPagination,
    pageCount,
    manualSorting,
    onSortingChange,
  });

  // Density-based padding classes
  const densityClasses = {
    compact: "px-2 py-1",
    comfortable: "px-4 py-2",
    spacious: "px-6 py-4",
  };

  const cellPadding = densityClasses[density];

  return (
    <div className="relative w-full overflow-auto">
      <table className="w-full border-collapse">
        <thead
          className={cn(
            "bg-[hsl(var(--table-header-bg))] text-[hsl(var(--table-header-fg))]",
            enableStickyHeader && "sticky top-0 z-10"
          )}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="border-b border-[hsl(var(--table-border))]"
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={cn(
                    "text-left font-medium",
                    cellPadding,
                    header.column.getCanSort() &&
                      "cursor-pointer select-none hover:bg-[hsl(var(--table-row-hover))]"
                  )}
                  style={{
                    width: header.getSize(),
                    position: "relative",
                  }}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  {header.column.getCanSort() && (
                    <span className="ml-2">
                      {{
                        asc: "↑",
                        desc: "↓",
                      }[header.column.getIsSorted() as string] ?? "↕"}
                    </span>
                  )}
                  {enableColumnResizing && header.column.getCanResize() && (
                    <button
                      type="button"
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={cn(
                        "absolute right-0 top-0 h-full w-1 cursor-col-resize bg-border opacity-0 hover:opacity-100",
                        header.column.getIsResizing() &&
                          "opacity-100 bg-primary"
                      )}
                      aria-label="Resize column"
                    />
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className={cn("text-center text-muted-foreground", cellPadding)}
              >
                No data available
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  "border-b border-[hsl(var(--table-border))] transition-colors hover:bg-[hsl(var(--table-row-hover))]",
                  row.getIsSelected() && "bg-[hsl(var(--table-row-hover))]"
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={cellPadding}
                    style={{
                      width: cell.column.getSize(),
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
