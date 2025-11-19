"use client";

import type { ColumnDef, SortingState } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import { Icons } from "@/components/icons/registry";
import { Can } from "@/components/rbac/can";
import { DataTable, DensityToggle } from "@/components/shared/data-table";
import { Pagination, PaginationInfo } from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Stack } from "@/components/ui/stack";
import { useItems } from "@/hooks/use-items";
import { buildImageUrl } from "@/lib/imagekit/url-builder";
import {
  numberParser,
  sortOrderParser,
  stringArrayParser,
} from "@/lib/nuqs/parsers";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import type { Database } from "@/types/database.types";

type ItemStatus = Database["public"]["Tables"]["items"]["Row"]["status"];
type Item = Database["public"]["Tables"]["items"]["Row"];

export default function ItemsTablePage() {
  // URL state management with Nuqs
  const [page, setPage] = useQueryState("page", numberParser.withDefault(1));
  const [limit] = useQueryState("limit", numberParser.withDefault(10));
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
  });
  const [statusFilter, setStatusFilter] = useQueryState(
    "status",
    stringArrayParser.withDefault([]),
  );
  const [sortBy, setSortBy] = useQueryState("sortBy", {
    defaultValue: "created_at",
  });
  const [sortOrder, setSortOrder] = useQueryState(
    "sortOrder",
    sortOrderParser.withDefault("desc"),
  );

  // Local state for search input
  const [searchInput, setSearchInput] = useState(search);

  // Sorting state for TanStack Table
  const sorting: SortingState = useMemo(
    () => [
      {
        id: sortBy,
        desc: sortOrder === "desc",
      },
    ],
    [sortBy, sortOrder],
  );

  const handleSortingChange = (
    updater: SortingState | ((old: SortingState) => SortingState),
  ) => {
    const newSorting =
      typeof updater === "function" ? updater(sorting) : updater;
    if (newSorting.length > 0) {
      setSortBy(newSorting[0].id);
      setSortOrder(newSorting[0].desc ? "desc" : "asc");
    }
  };

  // Fetch items
  const { data, isLoading, error } = useItems({
    page,
    limit,
    search,
    status: statusFilter as ItemStatus[],
    sortBy,
    sortOrder,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleStatusToggle = (status: ItemStatus) => {
    const newStatus = statusFilter.includes(status)
      ? statusFilter.filter((s) => s !== status)
      : [...statusFilter, status];
    setStatusFilter(newStatus.length > 0 ? newStatus : null);
    setPage(1);
  };

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  // Define columns
  const columns = useMemo<ColumnDef<Item>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <Link
              href={`/dashboard/items/${item.id}`}
              className="font-medium text-primary hover:underline"
            >
              {item.title}
            </Link>
          );
        },
        enableSorting: true,
        size: 250,
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
          const description = row.original.description;
          return (
            <span className="line-clamp-2 text-sm text-muted-foreground">
              {description || "—"}
            </span>
          );
        },
        enableSorting: false,
        size: 300,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <span
              className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                status === "active"
                  ? "bg-success/10 text-success"
                  : status === "inactive"
                    ? "bg-warning/10 text-warning"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {status}
            </span>
          );
        },
        enableSorting: true,
        size: 120,
      },
      {
        accessorKey: "image_url",
        header: "Image",
        cell: ({ row }) => {
          const imageUrl = row.original.image_url;
          return imageUrl ? (
            <Image
              src={buildImageUrl(imageUrl, {
                width: 60,
                height: 60,
                crop: "maintain_ratio",
                quality: 80,
                format: "auto",
              })}
              alt={row.original.title}
              width={40}
              height={40}
              className="h-10 w-10 rounded object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
              <Icons.image className="h-5 w-5 text-muted-foreground" />
            </div>
          );
        },
        enableSorting: false,
        size: 80,
      },
      {
        accessorKey: "created_at",
        header: "Created",
        cell: ({ row }) => {
          return (
            <span className="text-sm text-muted-foreground">
              {new Date(row.original.created_at).toLocaleDateString()}
            </span>
          );
        },
        enableSorting: true,
        size: 120,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <Stack direction="horizontal" gap="sm">
              <Can permission={PERMISSIONS.ITEMS_UPDATE}>
                <Link href={`/dashboard/items/${item.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Icons.edit className="h-4 w-4" />
                  </Button>
                </Link>
              </Can>
              <Can permission={PERMISSIONS.ITEMS_DELETE}>
                <Button variant="danger" size="sm">
                  <Icons.trash className="h-4 w-4" />
                </Button>
              </Can>
            </Stack>
          );
        },
        enableSorting: false,
        size: 120,
      },
    ],
    [],
  );

  return (
    <Container size="full" className="py-8">
      <Stack direction="vertical" gap="lg">
        {/* Header */}
        <Stack direction="horizontal" justify="between" align="center">
          <div>
            <h1 className="text-3xl font-bold">Items Table</h1>
            <p className="text-muted-foreground">
              Advanced data table with sorting, filtering, and pagination
            </p>
          </div>
          <Stack direction="horizontal" gap="sm">
            <Link href="/dashboard/items">
              <Button variant="outline">
                <Icons.grid className="mr-2 h-4 w-4" />
                Grid View
              </Button>
            </Link>
            <Can permission={PERMISSIONS.ITEMS_CREATE}>
              <Link href="/dashboard/items/new">
                <Button className="flex items-center gap-2">
                  <Icons.plus className="h-4 w-4" />
                  Create Item
                </Button>
              </Link>
            </Can>
          </Stack>
        </Stack>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <Stack direction="vertical" gap="md">
              {/* Search */}
              <form onSubmit={handleSearchSubmit}>
                <Stack direction="horizontal" gap="sm">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Search items by title or description..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                  </div>
                  <Button type="submit">
                    <Icons.search className="h-4 w-4" />
                  </Button>
                </Stack>
              </form>

              {/* Status Filter and Density Toggle */}
              <Stack direction="horizontal" justify="between" align="center">
                <div>
                  <p className="mb-2 text-sm font-medium">Filter by status:</p>
                  <Stack direction="horizontal" gap="sm">
                    <Button
                      variant={
                        statusFilter.includes("active") ? "primary" : "outline"
                      }
                      size="sm"
                      onClick={() => handleStatusToggle("active")}
                    >
                      Active
                    </Button>
                    <Button
                      variant={
                        statusFilter.includes("inactive")
                          ? "primary"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => handleStatusToggle("inactive")}
                    >
                      Inactive
                    </Button>
                    <Button
                      variant={
                        statusFilter.includes("archived")
                          ? "primary"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => handleStatusToggle("archived")}
                    >
                      Archived
                    </Button>
                    {statusFilter.length > 0 && (
                      <Button
                        variant="subtle"
                        size="sm"
                        onClick={() => setStatusFilter(null)}
                      >
                        Clear
                      </Button>
                    )}
                  </Stack>
                </div>
                <DensityToggle />
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card variant="outline">
            <CardContent className="py-12 text-center">
              <p className="text-danger">
                Failed to load items. Please try again.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Data Table */}
        {!isLoading && !error && data && (
          <>
            <Card>
              <DataTable
                columns={columns}
                data={data.items as Item[]}
                enableColumnResizing
                enableStickyHeader
                manualPagination
                pageCount={totalPages}
                manualSorting
                sorting={sorting}
                onSortingChange={handleSortingChange}
              />
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}

            {/* Results Info */}
            <PaginationInfo
              currentPage={page}
              pageSize={limit}
              totalItems={data.total}
            />
          </>
        )}
      </Stack>
    </Container>
  );
}
