"use client";

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
import { DENSITY_CLASSES, type TableDensity } from "@/types/density";

interface DataTableSkeletonProps {
  /**
   * Number of columns to display
   * @default 5
   */
  columnCount?: number;
  /**
   * Number of rows to display
   * @default 10
   */
  rowCount?: number;
  /**
   * Show search bar skeleton
   * @default true
   */
  showSearch?: boolean;
  /**
   * Show filter skeleton
   * @default true
   */
  showFilters?: boolean;
  /**
   * Show pagination skeleton
   * @default true
   */
  showPagination?: boolean;
  /**
   * Show view options skeleton
   * @default true
   */
  showViewOptions?: boolean;
  /**
   * Custom className for the container
   */
  className?: string;
  /**
   * Show table border
   * @default true
   */
  bordered?: boolean;
  /**
   * Table density (spacing)
   * @default "comfortable"
   */
  density?: TableDensity;
  /**
   * Show checkbox column
   * @default false
   */
  showCheckbox?: boolean;
}

export function DataTableSkeleton({
  columnCount = 5,
  rowCount = 10,
  showSearch = true,
  showFilters = true,
  showPagination = true,
  showViewOptions = true,
  className,
  bordered = true,
  density = "comfortable",
  showCheckbox = false,
}: DataTableSkeletonProps) {
  const densityClass = DENSITY_CLASSES[density];

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Toolbar Skeleton */}
      {(showSearch || showFilters || showViewOptions) && (
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-1 items-center gap-2">
            {showSearch && <Skeleton className="h-10 w-[250px]" />}
            {showFilters && (
              <>
                <Skeleton className="h-10 w-[120px]" />
                <Skeleton className="h-10 w-[120px]" />
              </>
            )}
          </div>
          {showViewOptions && <Skeleton className="h-10 w-[100px]" />}
        </div>
      )}

      {/* Table Skeleton */}
      <div className={cn("rounded-md", bordered && "border")}>
        <Table>
          <TableHeader>
            <TableRow>
              {showCheckbox && (
                <TableHead className={cn(densityClass, "w-12")}>
                  <Skeleton className="h-4 w-4" />
                </TableHead>
              )}
              {Array.from({ length: columnCount }).map((_, index) => (
                <TableHead key={`header-${index}`} className={densityClass}>
                  <Skeleton className="h-4 w-[100px]" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <TableRow key={`row-${rowIndex}`}>
                {showCheckbox && (
                  <TableCell className={cn(densityClass, "w-12")}>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                )}
                {Array.from({ length: columnCount }).map((_, cellIndex) => (
                  <TableCell key={`cell-${cellIndex}`} className={densityClass}>
                    <Skeleton
                      className={cn(
                        "h-4",
                        // Vary widths for more realistic look
                        cellIndex === 0 && "w-[180px]",
                        cellIndex === 1 && "w-[140px]",
                        cellIndex === 2 && "w-[100px]",
                        cellIndex === 3 && "w-[120px]",
                        cellIndex >= 4 && "w-[80px]"
                      )}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Skeleton */}
      {showPagination && (
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-[200px]" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-[100px]" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>
      )}
    </div>
  );
}
