# DataTable Component

A powerful, feature-rich data table component built with TanStack Table v8 that supports column resizing, sticky headers, row selection, server-side pagination, sorting, and filtering.

## Features

- ✅ Column resizing with visual feedback
- ✅ Sticky header support for long tables
- ✅ Row selection with state management
- ✅ Server-side pagination with manual control
- ✅ Server-side sorting with URL state sync
- ✅ Density toggle (compact, comfortable, spacious)
- ✅ Responsive design with semantic tokens
- ✅ TypeScript support with full type safety

## Basic Usage

```tsx
import { DataTable } from "@/components/shared/data-table";
// or
import { DataTable } from "@/components/shared";
import { type ColumnDef } from "@tanstack/react-table";

interface User {
  id: string;
  name: string;
  email: string;
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
  },
  {
    accessorKey: "email",
    header: "Email",
    enableSorting: true,
  },
];

function UsersTable() {
  const users = [
    { id: "1", name: "John Doe", email: "john@example.com" },
    { id: "2", name: "Jane Smith", email: "jane@example.com" },
  ];

  return <DataTable columns={columns} data={users} />;
}
```

## Advanced Features

### Column Resizing

Enable column resizing by setting `enableColumnResizing={true}`:

```tsx
<DataTable columns={columns} data={data} enableColumnResizing />
```

Set initial column widths in your column definitions:

```tsx
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    size: 200, // Initial width in pixels
  },
];
```

### Sticky Header

Enable sticky headers for long tables:

```tsx
<DataTable columns={columns} data={data} enableStickyHeader />
```

### Row Selection

Enable row selection and manage selected rows:

```tsx
const [rowSelection, setRowSelection] = useState({});

<DataTable
  columns={columns}
  data={data}
  enableRowSelection
  rowSelection={rowSelection}
  onRowSelectionChange={setRowSelection}
/>;
```

### Server-Side Pagination

For large datasets, use server-side pagination:

```tsx
const [page, setPage] = useState(1);
const { data, isLoading } = useQuery({
  queryKey: ["users", page],
  queryFn: () => fetchUsers({ page, limit: 10 }),
});

const totalPages = Math.ceil(data.total / 10);

<DataTable
  columns={columns}
  data={data.items}
  manualPagination
  pageCount={totalPages}
/>

<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
/>
```

### Server-Side Sorting

Sync sorting state with URL params using Nuqs:

```tsx
import { sortOrderParser } from "@/lib/nuqs/parsers";

const [sortBy, setSortBy] = useQueryState("sortBy", {
  defaultValue: "created_at",
});
const [sortOrder, setSortOrder] = useQueryState(
  "sortOrder",
  sortOrderParser.withDefault("desc")
);

const sorting = useMemo(
  () => [{ id: sortBy, desc: sortOrder === "desc" }],
  [sortBy, sortOrder]
);

const handleSortingChange = (updater) => {
  const newSorting = typeof updater === "function" ? updater(sorting) : updater;
  if (newSorting.length > 0) {
    setSortBy(newSorting[0].id);
    setSortOrder(newSorting[0].desc ? "desc" : "asc");
  }
};

<DataTable
  columns={columns}
  data={data}
  manualSorting
  sorting={sorting}
  onSortingChange={handleSortingChange}
/>;
```

### Density Toggle

Use the `DensityToggle` component to let users control table density:

```tsx
import { DensityToggle } from "@/components/shared/data-table";
// or
import { DensityToggle } from "@/components/shared";

<DensityToggle />
<DataTable columns={columns} data={data} />
```

The density is automatically applied from the Zustand store.

## Complete Example

See `/app/(dashboard)/dashboard/items/table/page.tsx` for a complete example with:

- Server-side pagination
- Server-side sorting
- Server-side filtering
- Column resizing
- Sticky headers
- Density toggle
- URL state management with Nuqs

## Props

### DataTable Props

| Prop                   | Type                            | Default  | Description                            |
| ---------------------- | ------------------------------- | -------- | -------------------------------------- |
| `columns`              | `ColumnDef<TData, TValue>[]`    | Required | Column definitions                     |
| `data`                 | `TData[]`                       | Required | Table data                             |
| `enableRowSelection`   | `boolean`                       | `false`  | Enable row selection                   |
| `enableColumnResizing` | `boolean`                       | `false`  | Enable column resizing                 |
| `enableStickyHeader`   | `boolean`                       | `false`  | Enable sticky header                   |
| `onRowSelectionChange` | `OnChangeFn<RowSelectionState>` | -        | Row selection change handler           |
| `rowSelection`         | `RowSelectionState`             | `{}`     | Row selection state                    |
| `manualPagination`     | `boolean`                       | `false`  | Enable manual pagination               |
| `pageCount`            | `number`                        | -        | Total page count for manual pagination |
| `manualSorting`        | `boolean`                       | `false`  | Enable manual sorting                  |
| `onSortingChange`      | `(sorting: any) => void`        | -        | Sorting change handler                 |
| `sorting`              | `any`                           | `[]`     | Sorting state                          |

### Pagination Props

| Prop           | Type                     | Description           |
| -------------- | ------------------------ | --------------------- |
| `currentPage`  | `number`                 | Current page number   |
| `totalPages`   | `number`                 | Total number of pages |
| `onPageChange` | `(page: number) => void` | Page change handler   |
| `className`    | `string`                 | Optional CSS class    |

### PaginationInfo Props

| Prop          | Type     | Description           |
| ------------- | -------- | --------------------- |
| `currentPage` | `number` | Current page number   |
| `pageSize`    | `number` | Items per page        |
| `totalItems`  | `number` | Total number of items |
| `className`   | `string` | Optional CSS class    |

## Styling

The DataTable uses semantic tokens for consistent theming:

- `--table-header-bg`: Header background color
- `--table-header-fg`: Header text color
- `--table-row-hover`: Row hover background color
- `--table-border`: Border color

These tokens automatically adapt to light and dark modes.

## Accessibility

- Sortable columns are keyboard accessible
- Column resize handles are touch-friendly
- Proper ARIA labels for interactive elements
- Semantic HTML structure

## Performance Tips

1. Use `useMemo` for column definitions to prevent re-renders
2. Enable server-side pagination for large datasets
3. Use `enableColumnResizing` only when needed
4. Implement virtual scrolling for very large tables (not included)

## Related Components

- `Pagination`: Pagination controls
- `PaginationInfo`: Results information display
- `DensityToggle`: Table density control
- `useTableStore`: Zustand store for table preferences

---

## New Enhanced Features

### useDataTable Hook

A comprehensive hook that manages all table state with URL persistence via Nuqs. Handles pagination, sorting, searching, filtering, row selection, and column visibility.

**Example:**

```tsx
import { useDataTable } from "@/components/shared/data-table";

const {
  table, // TanStack Table instance
  page, // Current page (1-indexed)
  limit, // Items per page
  sortBy, // Current sort column
  sortOrder, // Sort direction ('asc' | 'desc')
  search, // Global search value
  setPage,
  setLimit,
  setSort,
  setSearch,
  reset, // Reset all state
} = useDataTable({
  columns,
  data,
  manualPagination: true,
  pageCount: 10,
  manualSorting: true,
  enableRowSelection: true,
  enableGlobalFilter: true,
  defaultPageSize: 10,
  onPaginationChange: (page, limit) => {
    console.log("Page changed:", page, limit);
  },
  onSortingChange: (sortBy, sortOrder) => {
    console.log("Sort changed:", sortBy, sortOrder);
  },
  onSearchChange: (search) => {
    console.log("Search changed:", search);
  },
});
```

### DataTableToolbar Component

Toolbar with debounced search and custom action slots.

```tsx
import {
  DataTableToolbar,
  DataTableViewOptions,
} from "@/components/shared/data-table";

<DataTableToolbar
  table={table}
  searchValue={search}
  onSearchChange={setSearch}
  searchPlaceholder="Search users..."
>
  <DataTableViewOptions table={table} />
  <Button>Add User</Button>
</DataTableToolbar>;
```

### DataTablePagination Component

Full-featured pagination with page size selector and navigation buttons.

```tsx
import { DataTablePagination } from "@/components/shared/data-table";

<DataTablePagination
  table={table}
  pageSizeOptions={[10, 20, 50, 100]}
  showSelectedCount={true}
/>;
```

### DataTableViewOptions Component

Combined control for column visibility and table density.

```tsx
import { DataTableViewOptions } from "@/components/shared/data-table";

<DataTableViewOptions
  table={table}
  showDensityControl={true}
  showColumnVisibility={true}
/>;
```

### Loading, Error, and Empty States

The DataTable now supports multiple states:

```tsx
<DataTable
  columns={columns}
  data={data}
  isLoading={isLoading} // Show skeleton rows
  isError={isError} // Show error message
  error={error} // Error object
  emptyTitle="No users found" // Empty state title
  emptyDescription="Try a different search" // Empty state description
  emptyAction={<Button>Clear Filters</Button>} // Empty state action
  loadingRowCount={5} // Number of skeleton rows
/>
```

### Complete Server-Side Example

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import {
  DataTable,
  DataTableToolbar,
  DataTablePagination,
  DataTableViewOptions,
  useDataTable,
} from "@/components/shared/data-table";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
  },
  {
    accessorKey: "email",
    header: "Email",
    enableSorting: true,
  },
  {
    accessorKey: "role",
    header: "Role",
  },
];

export function UsersTable() {
  const { table, page, limit, sortBy, sortOrder, search, setSearch } =
    useDataTable({
      columns,
      data: [],
      manualPagination: true,
      manualSorting: true,
      enableRowSelection: true,
      enableGlobalFilter: true,
      defaultPageSize: 10,
    });

  // Fetch data from server
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users", page, limit, sortBy, sortOrder, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(sortBy && { sortBy }),
        ...(sortOrder && { sortOrder }),
        ...(search && { search }),
      });
      const res = await fetch(`/api/users?${params}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  const users = response?.data ?? [];
  const pageCount = response?.pageCount ?? 0;

  // Update table with fetched data
  table.options.data = users;
  table.options.pageCount = pageCount;

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search users..."
      >
        <DataTableViewOptions table={table} />
      </DataTableToolbar>

      <DataTable
        columns={columns}
        data={users}
        enableRowSelection
        enableStickyHeader
        manualPagination
        pageCount={pageCount}
        manualSorting
        sorting={table.getState().sorting}
        onSortingChange={table.setSorting}
        rowSelection={table.getState().rowSelection}
        onRowSelectionChange={table.setRowSelection}
        columnVisibility={table.getState().columnVisibility}
        onColumnVisibilityChange={table.setColumnVisibility}
        isLoading={isLoading}
        isError={isError}
        error={error}
        emptyTitle="No users found"
        emptyDescription="Try adjusting your search or filters"
      />

      <DataTablePagination table={table} />
    </div>
  );
}
```

### URL State Persistence

The `useDataTable` hook automatically syncs state with URL parameters:

- `page` - Current page number
- `limit` - Items per page
- `sortBy` - Sort column
- `sortOrder` - Sort direction (asc/desc)
- `search` - Global search query

Example URL: `/users?page=2&limit=20&sortBy=name&sortOrder=asc&search=john`

This enables:

- Shareable links with filter/sort state
- Browser back/forward navigation
- Bookmarkable table views

### Custom Hooks

A new `useDebouncedCallback` hook is included at `/hooks/use-debounced-callback.ts` for optimized search performance.
