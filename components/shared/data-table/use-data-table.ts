"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type OnChangeFn,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useMemo, useState } from "react";
import { useTableStore } from "@/stores/table.store";

/**
 * Options for useDataTable hook
 */
export interface UseDataTableOptions<TData, TValue = unknown> {
  /** Column definitions */
  columns: ColumnDef<TData, TValue>[];
  /** Table data */
  data: TData[];
  /** Enable manual pagination (for server-side) */
  manualPagination?: boolean;
  /** Total page count (required if manualPagination is true) */
  pageCount?: number;
  /** Enable manual sorting (for server-side) */
  manualSorting?: boolean;
  /** Enable manual filtering (for server-side) */
  manualFiltering?: boolean;
  /** Enable row selection */
  enableRowSelection?: boolean;
  /** Enable column filters */
  enableColumnFilters?: boolean;
  /** Enable global filter/search */
  enableGlobalFilter?: boolean;
  /** Default page size */
  defaultPageSize?: number;
  /** Page size options */
  pageSizeOptions?: number[];
  /** Enable URL state persistence */
  enableUrlState?: boolean;
  /** Default sorting */
  defaultSorting?: SortingState;
  /** Default column visibility */
  defaultColumnVisibility?: VisibilityState;
  /** Row ID accessor */
  getRowId?: (row: TData, index: number) => string;
  /** Callback when pagination changes */
  onPaginationChange?: (page: number, limit: number) => void;
  /** Callback when sorting changes */
  onSortingChange?: (
    sortBy: string | null,
    sortOrder: "asc" | "desc" | null
  ) => void;
  /** Callback when search changes */
  onSearchChange?: (search: string) => void;
  /** Callback when row selection changes */
  onRowSelectionChange?: (selectedRows: TData[]) => void;
}

/**
 * Comprehensive hook for managing TanStack Table state with URL persistence
 *
 * Features:
 * - Pagination state (page, limit) synced with URL
 * - Sorting state (sortBy, sortOrder) synced with URL
 * - Global search synced with URL
 * - Column filters (local state)
 * - Row selection (local state)
 * - Column visibility (local state)
 * - Density from global store
 * - Manual mode support for server-side operations
 *
 * @example
 * ```tsx
 * const { table, page, limit, sortBy, sortOrder, search } = useDataTable({
 *   columns,
 *   data,
 *   manualPagination: true,
 *   pageCount: 10,
 *   manualSorting: true,
 *   enableRowSelection: true,
 * });
 * ```
 */
export function useDataTable<TData, TValue = unknown>({
  columns,
  data,
  manualPagination = false,
  pageCount,
  manualSorting = false,
  manualFiltering = false,
  enableRowSelection = false,
  enableColumnFilters: _enableColumnFilters = false,
  enableGlobalFilter: _enableGlobalFilter = false,
  defaultPageSize = 10,
  pageSizeOptions = [10, 20, 30, 40, 50, 100],
  enableUrlState = true,
  defaultSorting = [],
  defaultColumnVisibility = {},
  getRowId,
  onPaginationChange,
  onSortingChange,
  onSearchChange,
  onRowSelectionChange,
}: UseDataTableOptions<TData, TValue>) {
  // URL state for pagination, sorting, and search
  const [urlState, setUrlState] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(defaultPageSize),
      sortBy: parseAsString,
      sortOrder: parseAsString,
      search: parseAsString.withDefault(""),
    },
    {
      history: enableUrlState ? "push" : "replace",
      shallow: true,
    }
  );

  // Local state for row selection
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Local state for column visibility
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    defaultColumnVisibility
  );

  // Local state for column filters
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Global filter (search)
  const [globalFilter, setGlobalFilter] = useState(urlState.search);

  // Get density from store
  const density = useTableStore((state) => state.density);
  const setDensity = useTableStore((state) => state.setDensity);

  // Convert URL state to TanStack Table pagination state
  const pagination = useMemo<PaginationState>(
    () => ({
      pageIndex: urlState.page - 1, // TanStack uses 0-indexed
      pageSize: urlState.limit,
    }),
    [urlState.page, urlState.limit]
  );

  // Convert URL state to TanStack Table sorting state
  const sorting = useMemo<SortingState>(() => {
    if (!urlState.sortBy) return defaultSorting;
    return [
      {
        id: urlState.sortBy,
        desc: urlState.sortOrder === "desc",
      },
    ];
  }, [urlState.sortBy, urlState.sortOrder, defaultSorting]);

  // Pagination change handler
  const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const newPagination =
      typeof updater === "function" ? updater(pagination) : updater;

    const newPage = newPagination.pageIndex + 1;
    const newLimit = newPagination.pageSize;

    setUrlState({
      page: newPage,
      limit: newLimit,
    });

    onPaginationChange?.(newPage, newLimit);
  };

  // Sorting change handler
  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const newSorting =
      typeof updater === "function" ? updater(sorting) : updater;

    const firstSort = newSorting[0];
    const newSortBy = firstSort?.id ?? null;
    const newSortOrder = firstSort?.desc ? "desc" : firstSort ? "asc" : null;

    setUrlState({
      sortBy: newSortBy,
      sortOrder: newSortOrder,
      page: 1, // Reset to first page when sorting changes
    });

    onSortingChange?.(newSortBy, newSortOrder);
  };

  // Column filters change handler
  const handleColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (
    updater
  ) => {
    const newFilters =
      typeof updater === "function" ? updater(columnFilters) : updater;
    setColumnFilters(newFilters);

    // Reset to first page when filters change
    setUrlState({ page: 1 });
  };

  // Row selection change handler
  const handleRowSelectionChange: OnChangeFn<RowSelectionState> = (updater) => {
    const newSelection =
      typeof updater === "function" ? updater(rowSelection) : updater;
    setRowSelection(newSelection);

    // Get selected rows
    if (onRowSelectionChange) {
      const selectedRows = Object.keys(newSelection)
        .filter((key) => newSelection[key])
        .map((key) => {
          const index = Number.parseInt(key, 10);
          return data[index];
        })
        .filter(Boolean);
      onRowSelectionChange(selectedRows);
    }
  };

  // Column visibility change handler
  const handleColumnVisibilityChange: OnChangeFn<VisibilityState> = (
    updater
  ) => {
    const newVisibility =
      typeof updater === "function" ? updater(columnVisibility) : updater;
    setColumnVisibility(newVisibility);
  };

  // Global filter change handler
  const handleGlobalFilterChange = (value: string) => {
    setGlobalFilter(value);
    setUrlState({ search: value, page: 1 }); // Reset to first page
    onSearchChange?.(value);
  };

  // Create table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // Pagination
    ...(manualPagination
      ? {
          manualPagination: true,
          pageCount,
        }
      : {
          getPaginationRowModel: getPaginationRowModel(),
        }),
    onPaginationChange: handlePaginationChange,
    // Sorting
    ...(manualSorting
      ? {
          manualSorting: true,
        }
      : {
          getSortedRowModel: getSortedRowModel(),
        }),
    onSortingChange: handleSortingChange,
    // Filtering
    ...(manualFiltering
      ? {
          manualFiltering: true,
        }
      : {
          getFilteredRowModel: getFilteredRowModel(),
        }),
    onColumnFiltersChange: handleColumnFiltersChange,
    onGlobalFilterChange: handleGlobalFilterChange,
    // Row selection
    enableRowSelection,
    onRowSelectionChange: handleRowSelectionChange,
    // Column visibility
    onColumnVisibilityChange: handleColumnVisibilityChange,
    // Row ID
    getRowId,
    // State
    state: {
      pagination,
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
      columnVisibility,
    },
  });

  // Helper functions
  const setPage = (page: number) => {
    setUrlState({ page });
    onPaginationChange?.(page, urlState.limit);
  };

  const setLimit = (limit: number) => {
    setUrlState({ limit, page: 1 }); // Reset to first page
    onPaginationChange?.(1, limit);
  };

  const setSort = (column: string | null, order: "asc" | "desc" | null) => {
    setUrlState({
      sortBy: column,
      sortOrder: order,
      page: 1,
    });
    onSortingChange?.(column, order);
  };

  const setSearch = (search: string) => {
    handleGlobalFilterChange(search);
  };

  const clearFilters = () => {
    setColumnFilters([]);
    setGlobalFilter("");
    setUrlState({ search: "", page: 1 });
  };

  const reset = () => {
    setUrlState({
      page: 1,
      limit: defaultPageSize,
      sortBy: null,
      sortOrder: null,
      search: "",
    });
    setRowSelection({});
    setColumnFilters([]);
    setGlobalFilter("");
    setColumnVisibility(defaultColumnVisibility);
  };

  return {
    table,
    // State
    page: urlState.page,
    limit: urlState.limit,
    sortBy: urlState.sortBy ?? null,
    sortOrder: (urlState.sortOrder as "asc" | "desc" | null) ?? null,
    search: urlState.search,
    columnFilters,
    rowSelection,
    columnVisibility,
    density,
    pagination,
    sorting,
    globalFilter,
    // Setters
    setPage,
    setLimit,
    setSort,
    setSearch,
    setColumnFilters,
    setRowSelection,
    setColumnVisibility,
    setDensity,
    setGlobalFilter: handleGlobalFilterChange,
    clearFilters,
    reset,
    // Options
    pageSizeOptions,
    // Computed
    selectedRows: Object.keys(rowSelection)
      .filter((key) => rowSelection[key])
      .map((key) => {
        const index = Number.parseInt(key, 10);
        return data[index];
      })
      .filter(Boolean),
  };
}
