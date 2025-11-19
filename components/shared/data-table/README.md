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
