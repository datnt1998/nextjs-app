"use client";

import type { Table } from "@tanstack/react-table";
import { SearchIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  children?: React.ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  children,
}: DataTableToolbarProps<TData>) {
  const [search, setSearch] = useState(searchValue);

  // Sync with external search value
  useEffect(() => {
    setSearch(searchValue);
  }, [searchValue]);

  // Debounced search handler
  const debouncedSearch = useDebouncedCallback((value: string) => {
    onSearchChange?.(value);
    table.setGlobalFilter(value);
  }, 300);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    debouncedSearch(value);
  };

  const handleClearSearch = () => {
    setSearch("");
    onSearchChange?.("");
    table.setGlobalFilter("");
  };

  const isFiltered = search.length > 0;

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative w-full max-w-sm">
          <SearchIcon className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 pr-9"
          />
          {isFiltered && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleClearSearch}
              className="absolute right-1 top-1/2 -translate-y-1/2"
            >
              <XIcon className="size-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
