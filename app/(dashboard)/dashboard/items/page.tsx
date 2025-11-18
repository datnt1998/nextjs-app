"use client";

import Link from "next/link";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { Icons } from "@/components/icons/registry";
import { Can } from "@/components/rbac/can";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Grid } from "@/components/ui/grid";
import { Input } from "@/components/ui/input";
import { Stack } from "@/components/ui/stack";
import { useItems } from "@/hooks/use-items";
import { buildImageUrl } from "@/lib/imagekit/url-builder";
import { numberParser, stringArrayParser } from "@/lib/nuqs/parsers";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import type { Database } from "@/types/database.types";

type ItemStatus = Database["public"]["Tables"]["items"]["Row"]["status"];
type Item = Database["public"]["Tables"]["items"]["Row"];

export default function ItemsPage() {
  // URL state management with Nuqs
  const [page, setPage] = useQueryState("page", numberParser.withDefault(1));
  const [limit] = useQueryState("limit", numberParser.withDefault(12));
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
  });
  const [statusFilter, setStatusFilter] = useQueryState(
    "status",
    stringArrayParser.withDefault([])
  );

  // Local state for search input
  const [searchInput, setSearchInput] = useState(search);

  // Fetch items
  const { data, isLoading, error } = useItems({
    page,
    limit,
    search,
    status: statusFilter as ItemStatus[],
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1); // Reset to first page on new search
  };

  const handleStatusToggle = (status: ItemStatus) => {
    const newStatus = statusFilter.includes(status)
      ? statusFilter.filter((s) => s !== status)
      : [...statusFilter, status];
    setStatusFilter(newStatus.length > 0 ? newStatus : null);
    setPage(1); // Reset to first page on filter change
  };

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  return (
    <Container size="xl" className="py-8">
      <Stack direction="vertical" gap="lg">
        {/* Header */}
        <Stack direction="horizontal" justify="between" align="center">
          <div>
            <h1 className="text-3xl font-bold">Items</h1>
            <p className="text-muted-foreground">
              Manage your items collection
            </p>
          </div>
          <Can permission={PERMISSIONS.ITEMS_CREATE}>
            <Link href="/dashboard/items/new">
              <Button className="flex items-center gap-2">
                <Icons.plus className="h-4 w-4" />
                Create Item
              </Button>
            </Link>
          </Can>
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

              {/* Status Filter */}
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
                      statusFilter.includes("inactive") ? "primary" : "outline"
                    }
                    size="sm"
                    onClick={() => handleStatusToggle("inactive")}
                  >
                    Inactive
                  </Button>
                  <Button
                    variant={
                      statusFilter.includes("archived") ? "primary" : "outline"
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

        {/* Empty State */}
        {!isLoading && !error && data && data.items.length === 0 && (
          <Card variant="outline">
            <CardContent className="py-12 text-center">
              <p className="mb-4 text-muted-foreground">
                {search || statusFilter.length > 0
                  ? "No items found matching your filters."
                  : "No items yet. Create your first item to get started."}
              </p>
              <Can permission={PERMISSIONS.ITEMS_CREATE}>
                <Link href="/dashboard/items/new">
                  <Button>Create Item</Button>
                </Link>
              </Can>
            </CardContent>
          </Card>
        )}

        {/* Items Grid */}
        {!isLoading && !error && data && data.items.length > 0 && (
          <>
            <Grid cols={3} gap="md">
              {(data.items as Item[]).map((item) => (
                <Link key={item.id} href={`/dashboard/items/${item.id}`}>
                  <Card
                    variant="outline"
                    className="h-full transition-all hover:shadow-md"
                  >
                    {/* Image */}
                    {item.image_url && (
                      <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                        <img
                          src={buildImageUrl(item.image_url, {
                            width: 400,
                            height: 300,
                            crop: "maintain_ratio",
                            quality: 85,
                            format: "auto",
                          })}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}

                    <CardContent className="pt-4">
                      <h3 className="mb-2 text-lg font-semibold">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                    </CardContent>

                    <CardFooter className="flex items-center justify-between border-t border-border pt-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          item.status === "active"
                            ? "bg-success/10 text-success"
                            : item.status === "inactive"
                              ? "bg-warning/10 text-warning"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {item.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Stack direction="horizontal" justify="center" gap="sm">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (p) =>
                        p === 1 ||
                        p === totalPages ||
                        (p >= page - 1 && p <= page + 1)
                    )
                    .map((p, idx, arr) => (
                      <div key={p} className="flex items-center gap-2">
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span className="text-muted-foreground">...</span>
                        )}
                        <Button
                          variant={p === page ? "primary" : "outline"}
                          size="sm"
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </Button>
                      </div>
                    ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </Stack>
            )}

            {/* Results Info */}
            <p className="text-center text-sm text-muted-foreground">
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, data.total)} of {data.total} items
            </p>
          </>
        )}
      </Stack>
    </Container>
  );
}
