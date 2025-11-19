"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type OnChangeFn,
  type RowSelectionState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  AlertCircleIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  InboxIcon,
} from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useTableStore } from "@/stores/table.store";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  enableRowSelection?: boolean;
  enableStickyHeader?: boolean;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  rowSelection?: RowSelectionState;
  manualPagination?: boolean;
  pageCount?: number;
  manualSorting?: boolean;
  onSortingChange?: OnChangeFn<SortingState>;
  sorting?: SortingState;
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  loadingRowCount?: number;
  className?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  enableRowSelection = false,
  enableStickyHeader = false,
  onRowSelectionChange,
  rowSelection = {},
  manualPagination = false,
  pageCount,
  manualSorting = false,
  onSortingChange,
  sorting = [],
  columnVisibility = {},
  onColumnVisibilityChange,
  isLoading = false,
  isError = false,
  error = null,
  emptyTitle = "No data available",
  emptyDescription = "There are no records to display at this time.",
  emptyAction,
  loadingRowCount = 5,
  className,
}: DataTableProps<TData, TValue>) {
  const density = useTableStore((state) => state.density);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection,
    onRowSelectionChange,
    state: {
      rowSelection,
      columnVisibility,
      ...(manualSorting && { sorting }),
    },
    manualPagination,
    pageCount,
    manualSorting,
    onSortingChange,
    onColumnVisibilityChange,
  });

  // Density-based padding classes
  const densityClasses = {
    compact: "h-8",
    comfortable: "h-10",
    spacious: "h-12",
  };

  const rowHeight = densityClasses[density];

  return (
    <div className={cn("w-full", className)}>
      <Table>
        <TableHeader
          className={cn(
            enableStickyHeader && "sticky top-0 z-10 bg-background"
          )}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    rowHeight,
                    header.column.getCanSort() && "cursor-pointer select-none"
                  )}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder ? null : (
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <div className="flex flex-col">
                          {header.column.getIsSorted() === "asc" ? (
                            <ArrowUpIcon className="size-3" />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <ArrowDownIcon className="size-3" />
                          ) : null}
                        </div>
                      )}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Loading state - show skeleton rows
            Array.from({ length: loadingRowCount }).map((_, index) => (
              <TableRow key={`loading-row-${index}`}>
                {columns.map((_, colIndex) => (
                  <TableCell
                    key={`loading-cell-${index}-${colIndex}`}
                    className={rowHeight}
                  >
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : isError ? (
            // Error state - show error message
            <TableRow>
              <TableCell colSpan={columns.length} className="h-64 p-0">
                <Empty className="border-0">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <AlertCircleIcon className="text-destructive" />
                    </EmptyMedia>
                    <EmptyTitle>Error loading data</EmptyTitle>
                    <EmptyDescription>
                      {error?.message ||
                        "An error occurred while loading the data. Please try again."}
                    </EmptyDescription>
                  </EmptyHeader>
                  {emptyAction && <EmptyContent>{emptyAction}</EmptyContent>}
                </Empty>
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length === 0 ? (
            // Empty state - no data
            <TableRow>
              <TableCell colSpan={columns.length} className="h-64 p-0">
                <Empty className="border-0">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <InboxIcon />
                    </EmptyMedia>
                    <EmptyTitle>{emptyTitle}</EmptyTitle>
                    <EmptyDescription>{emptyDescription}</EmptyDescription>
                  </EmptyHeader>
                  {emptyAction && <EmptyContent>{emptyAction}</EmptyContent>}
                </Empty>
              </TableCell>
            </TableRow>
          ) : (
            // Success state - show data
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={rowHeight}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
