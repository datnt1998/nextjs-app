# Nuqs Utilities

This directory contains utilities for managing URL search parameters using Nuqs.

## Parsers

Custom parsers for type-safe URL parameter handling:

```typescript
import { numberParser, stringArrayParser } from "@/lib/nuqs/parsers";

// Number parser
const [page, setPage] = useQueryState("page", numberParser.withDefault(1));

// String array parser
const [tags, setTags] = useQueryState("tags", stringArrayParser);
```

## Factory Patterns

Pre-configured parameter groups for common use cases:

```typescript
import { useQueryStates } from "nuqs";
import {
  paginationParams,
  sortParams,
  filterParams,
} from "@/lib/nuqs/factories";

// Pagination
const [{ page, limit }, setPagination] = useQueryStates(paginationParams);

// Sorting
const [{ sortBy, sortOrder }, setSort] = useQueryStates(sortParams);

// Filtering
const [{ search, status }, setFilters] = useQueryStates(filterParams);

// Combined usage
const [params, setParams] = useQueryStates({
  ...paginationParams,
  ...sortParams,
  ...filterParams,
});
```

## Helper Utilities

Utility functions for working with URL state:

```typescript
import {
  buildQueryString,
  parseQueryString,
  mergeParams,
  resetPagination,
} from "@/lib/nuqs/helpers";

// Build query string
const qs = buildQueryString({ page: 1, search: "test" });
// Result: "?page=1&search=test"

// Parse query string
const params = parseQueryString("?page=1&search=test");
// Result: { page: "1", search: "test" }

// Merge parameters
const merged = mergeParams(
  { page: "1", limit: "10" },
  { page: "2", search: "test" }
);
// Result: { page: "2", limit: "10", search: "test" }

// Reset pagination when filters change
const newParams = resetPagination({ page: 5, search: "new" });
// Result: { page: 1, search: "new" }
```

## Complete Example

```typescript
"use client";

import { useQueryStates } from "nuqs";
import { paginationParams, sortParams, filterParams } from "@/lib/nuqs";
import { resetPagination } from "@/lib/nuqs/helpers";

export function ItemsList() {
  const [params, setParams] = useQueryStates({
    ...paginationParams,
    ...sortParams,
    ...filterParams,
  });

  const handleSearch = (search: string) => {
    // Reset to page 1 when search changes
    setParams(resetPagination({ ...params, search }));
  };

  const handleSort = (sortBy: string) => {
    setParams({ ...params, sortBy });
  };

  const handlePageChange = (page: number) => {
    setParams({ ...params, page });
  };

  return (
    <div>
      <input
        type="text"
        value={params.search || ""}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
      />

      <button onClick={() => handleSort("title")}>
        Sort by Title
      </button>

      <div>Page: {params.page}</div>
      <button onClick={() => handlePageChange(params.page + 1)}>
        Next Page
      </button>
    </div>
  );
}
```
