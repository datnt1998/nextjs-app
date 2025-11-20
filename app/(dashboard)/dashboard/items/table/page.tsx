"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Icons } from "@/components/icons/registry";
import { Can } from "@/components/rbac/can";
import {
  DataTableFacetedFilter,
  DataTablePagination,
  DataTableViewOptions,
  useDataTable,
} from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Stack } from "@/components/ui/stack";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useItems } from "@/hooks/use-items";
import { buildImageUrl } from "@/lib/imagekit/url-builder";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database.types";
import type { DataTableFilterField } from "@/types/table";

type ItemStatus = Database["public"]["Tables"]["items"]["Row"]["status"];
type Item = Database["public"]["Tables"]["items"]["Row"];

// Filter field definitions for the new data table hook
const filterFields: DataTableFilterField<Item>[] = [
  {
    type: "input",
    id: "title",
    label: "Title",
    placeholder: "Search by title...",
  },
  {
    type: "checkbox",
    id: "status",
    label: "Status",
    options: [
      {
        label: "Active",
        value: "active",
      },
      {
        label: "Inactive",
        value: "inactive",
      },
      {
        label: "Archived",
        value: "archived",
      },
    ],
  },
];

export default function ItemsTablePage() {
  // Fetch items - for now using static params, will be enhanced with server-side fetching
  const { data, isLoading, error } = useItems({
    page: 1,
    limit: 10,
    search: "",
    status: [],
    sortBy: "created_at",
    sortOrder: "desc",
  });

  const totalPages = data ? Math.ceil(data.total / 10) : 0;

  // Define columns
  const columns = useMemo<ColumnDef<Item>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
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
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
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
                <Button variant="destructive" size="sm">
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
    []
  );

  // Use the new data table hook
  const { table } = useDataTable({
    data: (data?.items as Item[]) || [],
    columns,
    pageCount: totalPages,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
      sorting: [
        {
          id: "created_at",
          desc: true,
        },
      ],
    },
    manualPagination: false,
    manualSorting: false,
    manualFiltering: false,
  });

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

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-destructive">
                Failed to load items. Please try again.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Data Table */}
        {!isLoading && !error && data && (
          <Card>
            <CardContent className="p-0">
              <Stack direction="vertical" gap="md" className="p-4">
                {/* Toolbar */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-1 items-center gap-2">
                    {/* Search filter */}
                    <Input
                      placeholder="Search by title..."
                      value={
                        (table
                          .getColumn("title")
                          ?.getFilterValue() as string) ?? ""
                      }
                      onChange={(event) =>
                        table
                          .getColumn("title")
                          ?.setFilterValue(event.target.value)
                      }
                      className="max-w-sm"
                    />

                    {/* Faceted filters */}
                    {table.getColumn("status") && (
                      <DataTableFacetedFilter
                        column={table.getColumn("status")}
                        title="Status"
                        options={[
                          { label: "Active", value: "active" },
                          { label: "Inactive", value: "inactive" },
                          { label: "Archived", value: "archived" },
                        ]}
                      />
                    )}

                    {/* Reset filters */}
                    {table.getState().columnFilters.length > 0 && (
                      <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                      >
                        Reset
                      </Button>
                    )}
                  </div>

                  {/* View options */}
                  <DataTableViewOptions table={table} />
                </div>

                {/* Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <TableHead
                              key={header.id}
                              className={cn(
                                header.column.getCanSort() &&
                                  "cursor-pointer select-none"
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
                                      {header.column.getIsSorted() === "asc"
                                        ? "↑"
                                        : header.column.getIsSorted() === "desc"
                                          ? "↓"
                                          : null}
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
                      {table.getRowModel().rows.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center"
                          >
                            No results found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        table.getRowModel().rows.map((row) => (
                          <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <DataTablePagination table={table} />
              </Stack>
            </CardContent>
          </Card>
        )}
      </Stack>
    </Container>
  );
}
