"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { useQueryStates } from "nuqs";
import * as React from "react";
import { useDebounce } from "@/hooks/use-debounce";
import {
  getColumnFiltersParser,
  getSortingStateParser,
  numberParser,
} from "@/lib/nuqs/parsers";
import type { TableDensity } from "@/types/density";
import type { DataTableFilterField } from "@/types/table";

interface UseDataTableProps<TData, TValue> {
  /**
   * Column definitions
   */
  columns: ColumnDef<TData, TValue>[];
  /**
   * Data array
   */
  data: TData[];
  /**
   * Total page count for server-side pagination
   */
  pageCount?: number;
  /**
   * Filter field configuration
   */
  filterFields?: DataTableFilterField<TData>[];
  /**
   * Initial state
   */
  initialState?: {
    pagination?: Partial<PaginationState>;
    sorting?: SortingState;
    columnFilters?: ColumnFiltersState;
    columnVisibility?: VisibilityState;
  };
  /**
   * Enable manual pagination (for server-side)
   */
  manualPagination?: boolean;
  /**
   * Enable manual sorting (for server-side)
   */
  manualSorting?: boolean;
  /**
   * Enable manual filtering (for server-side)
   */
  manualFiltering?: boolean;
  /**
   * Enable row selection
   */
  enableRowSelection?: boolean;
  /**
   * Enable URL state synchronization
   */
  enableUrlState?: boolean;
  /**
   * Debounce delay for filter updates (ms)
   */
  debounceMs?: number;
  /**
   * Callback when filters change
   */
  onFiltersChange?: (filters: Record<string, string | string[] | null>) => void;
  /**
   * Callback when pagination changes
   */
  onPaginationChange?: (pagination: PaginationState) => void;
  /**
   * Callback when sorting changes
   */
  onSortingChange?: (sorting: SortingState) => void;
  /**
   * Initial density
   */
  initialDensity?: TableDensity;
}

export function useDataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  filterFields,
  initialState,
  manualPagination = false,
  manualSorting = false,
  manualFiltering = false,
  enableRowSelection = false,
  enableUrlState = true,
  debounceMs = 500,
  onFiltersChange,
  onPaginationChange,
  onSortingChange,
  initialDensity = "comfortable",
}: UseDataTableProps<TData, TValue>) {
  // URL state management with nuqs
  const [urlState, setUrlState] = useQueryStates(
    {
      page: numberParser.withDefault(1),
      perPage: numberParser.withDefault(
        initialState?.pagination?.pageSize ?? 10,
      ),
      sort: getSortingStateParser<TData>().withDefault(
        (initialState?.sorting ?? []) as any,
      ),
      filters: getColumnFiltersParser<TData>(filterFields).withDefault({}),
    },
    {
      history: "replace",
      shallow: true,
    },
  );

  // Local state (fallback when URL state is disabled)
  const [localPage, setLocalPage] = React.useState(
    initialState?.pagination?.pageIndex ?? 0,
  );
  const [localPageSize, setLocalPageSize] = React.useState(
    initialState?.pagination?.pageSize ?? 10,
  );
  const [localSorting, setLocalSorting] = React.useState<SortingState>(
    initialState?.sorting ?? [],
  );
  const [localFilters, setLocalFilters] = React.useState<ColumnFiltersState>(
    initialState?.columnFilters ?? [],
  );

  // Use URL state or local state based on enableUrlState flag
  const page = enableUrlState ? urlState.page : localPage + 1;
  const pageSize = enableUrlState ? urlState.perPage : localPageSize;
  const sorting = enableUrlState
    ? (urlState.sort as SortingState)
    : localSorting;

  // Convert filters from Record to ColumnFiltersState
  const columnFilters = React.useMemo<ColumnFiltersState>(() => {
    if (enableUrlState) {
      return Object.entries(urlState.filters)
        .filter(([_, value]) => value != null)
        .map(([id, value]) => ({ id, value }));
    }
    return localFilters;
  }, [enableUrlState, urlState.filters, localFilters]);

  // Row selection state
  const [rowSelection, setRowSelection] = React.useState({});

  // Column visibility state
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialState?.columnVisibility ?? {});

  // Density state
  const [density, setDensity] = React.useState<TableDensity>(initialDensity);

  // Debounced filters for callbacks
  const debouncedFilters = useDebounce(columnFilters, debounceMs);

  // Call onFiltersChange callback
  React.useEffect(() => {
    if (onFiltersChange) {
      const filtersRecord: Record<string, string | string[] | null> = {};
      for (const filter of debouncedFilters) {
        filtersRecord[filter.id] = filter.value as string | string[] | null;
      }
      onFiltersChange(filtersRecord);
    }
  }, [debouncedFilters, onFiltersChange]);

  // Pagination state handlers
  const paginationState = React.useMemo<PaginationState>(
    () => ({
      pageIndex: page - 1,
      pageSize,
    }),
    [page, pageSize],
  );

  const onPaginationChangeHandler = React.useCallback(
    (
      updater: PaginationState | ((old: PaginationState) => PaginationState),
    ) => {
      const newState =
        typeof updater === "function" ? updater(paginationState) : updater;

      if (enableUrlState) {
        setUrlState({
          page: newState.pageIndex + 1,
          perPage: newState.pageSize,
        });
      } else {
        setLocalPage(newState.pageIndex);
        setLocalPageSize(newState.pageSize);
      }

      onPaginationChange?.(newState);
    },
    [enableUrlState, paginationState, setUrlState, onPaginationChange],
  );

  // Sorting state handlers
  const onSortingChangeHandler = React.useCallback(
    (updater: SortingState | ((old: SortingState) => SortingState)) => {
      const newState =
        typeof updater === "function" ? updater(sorting) : updater;

      if (enableUrlState) {
        setUrlState({ sort: newState as any });
      } else {
        setLocalSorting(newState);
      }

      onSortingChange?.(newState);
    },
    [enableUrlState, sorting, setUrlState, onSortingChange],
  );

  // Column filters state handlers
  const onColumnFiltersChangeHandler = React.useCallback(
    (
      updater:
        | ColumnFiltersState
        | ((old: ColumnFiltersState) => ColumnFiltersState),
    ) => {
      const newState =
        typeof updater === "function" ? updater(columnFilters) : updater;

      if (enableUrlState) {
        // Convert ColumnFiltersState to Record for URL
        const filtersRecord: Record<string, string | string[] | null> = {};
        for (const filter of newState) {
          filtersRecord[filter.id] = filter.value as string | string[] | null;
        }
        setUrlState({ filters: filtersRecord, page: 1 }); // Reset to page 1 on filter change
      } else {
        setLocalFilters(newState);
        setLocalPage(0); // Reset to first page
      }
    },
    [enableUrlState, columnFilters, setUrlState],
  );

  // Create table instance
  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount,
    state: {
      pagination: paginationState,
      sorting,
      columnFilters,
      rowSelection,
      columnVisibility,
    },
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: onPaginationChangeHandler,
    onSortingChange: onSortingChangeHandler,
    onColumnFiltersChange: onColumnFiltersChangeHandler,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: manualFiltering ? undefined : getFilteredRowModel(),
    getPaginationRowModel: manualPagination
      ? undefined
      : getPaginationRowModel(),
    getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination,
    manualSorting,
    manualFiltering,
  });

  return { table, density, setDensity };
}
