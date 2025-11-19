"use client";

import { Button } from "@/components/ui/button";
import { Stack } from "@/components/ui/stack";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Near the start
        pages.push(2, 3, 4, "ellipsis", totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push(
          "ellipsis",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        // In the middle
        pages.push(
          "ellipsis",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "ellipsis",
          totalPages,
        );
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <Stack
      direction="horizontal"
      justify="center"
      gap="sm"
      className={cn("flex-wrap", className)}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>

      {pageNumbers.map((page) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${Math.random()}`}
            className="flex h-9 items-center px-2 text-muted-foreground"
          >
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={page === currentPage ? "primary" : "outline"}
            size="sm"
            onClick={() => onPageChange(page as number)}
          >
            {page}
          </Button>
        ),
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </Stack>
  );
}

interface PaginationInfoProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  className?: string;
}

export function PaginationInfo({
  currentPage,
  pageSize,
  totalItems,
  className,
}: PaginationInfoProps) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <p className={cn("text-center text-sm text-muted-foreground", className)}>
      Showing {start} to {end} of {totalItems} results
    </p>
  );
}
