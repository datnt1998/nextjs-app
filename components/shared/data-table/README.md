# Data Table Components

A comprehensive data table implementation with advanced filtering, sorting, pagination, and URL state management based on openstatusHQ patterns.

## Features

- ✅ **URL State Synchronization** - All table state (filters, sorting, pagination) synced to URL
- ✅ **Compact URL Serialization** - Space-efficient filter encoding (`status:active,pending`)
- ✅ **Multiple Filter Types** - Input, checkbox, slider, and timerange filters
- ✅ **Type-Safe** - Full TypeScript support with discriminated union types
- ✅ **Flexible** - Works with both client-side and server-side data
- ✅ **Accessible** - Built on Radix UI primitives
- ✅ **Customizable** - Extensive configuration options

## Quick Start

### Basic Usage

```tsx
import {
  useDataTable,
  DataTable,
  DataTablePagination,
  DataTableToolbar,
} from "@/components/shared/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { DataTableFilterField } from "@/types/table";

type Product = {
  id: string;
  name: string;
  status: "active" | "inactive";
};

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
];

const filterFields: DataTableFilterField<Product>[] = [
  {
    id: "name",
    label: "Product Name",
    type: "input",
    placeholder: "Search products...",
  },
  {
    id: "status",
    label: "Status",
    type: "checkbox",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
  },
];

function MyDataTable({ data }: { data: Product[] }) {
  const { table } = useDataTable({
    columns,
    data,
    filterFields,
    enableUrlState: true,
  });

  return (
    <>
      <DataTableToolbar table={table} filterFields={filterFields} />
      <DataTable table={table} columns={columns} />
      <DataTablePagination table={table} />
    </>
  );
}
```

## Components

### DataTable

Main table component that renders the data.

```tsx
<DataTable
  table={table}
  columns={columns}
  isLoading={false}
  emptyMessage="No results found."
  bordered={true}
/>
```

**Props:**

- `table` - Table instance from `useDataTable`
- `columns` - Column definitions
- `isLoading` - Show loading spinner
- `emptyMessage` - Message when no data
- `bordered` - Show table border
- `className` - Custom styles

### DataTableColumnHeader

Sortable column header with dropdown menu.

```tsx
<DataTableColumnHeader column={column} title="Product Name" />
```

**Features:**

- Sort ascending/descending
- Hide column option
- Visual sort indicators

### DataTablePagination

Pagination controls.

```tsx
<DataTablePagination
  table={table}
  pageSizeOptions={[10, 20, 30, 40, 50]}
  showRowsSelected={true}
/>
```

### DataTableToolbar

Toolbar with search and filter controls.

```tsx
<DataTableToolbar table={table} filterFields={filterFields}>
  <DataTableFacetedFilter
    column={table.getColumn("status")}
    title="Status"
    options={statusOptions}
  />
</DataTableToolbar>
```

### DataTableViewOptions

Column visibility toggle dropdown.

```tsx
<DataTableViewOptions table={table} />
```

## Filter Components

### DataTableFacetedFilter

Multi-select dropdown filter with badges.

```tsx
<DataTableFacetedFilter
  column={table.getColumn("status")}
  title="Status"
  options={[
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ]}
/>
```

**Features:**

- Multi-select with checkboxes
- Shows selected count
- Clear all option
- Displays facet counts

### DataTableFilterInput

Text input filter.

```tsx
<DataTableFilterInput
  column={table.getColumn("name")}
  title="Product Name"
  placeholder="Search..."
/>
```

### DataTableFilterSlider

Numeric range slider filter.

```tsx
<DataTableFilterSlider
  column={table.getColumn("price")}
  title="Price Range"
  min={0}
  max={1000}
  step={10}
/>
```

### DataTableFilterTimerange

Date range picker with presets.

```tsx
<DataTableFilterTimerange
  column={table.getColumn("createdAt")}
  title="Created Date"
  presets={[
    {
      label: "Last 7 days",
      startDate: subDays(new Date(), 7),
      endDate: new Date(),
    },
  ]}
/>
```

## Hook API

### useDataTable

Main hook for creating table instances.

```tsx
const { table } = useDataTable({
  columns,
  data,
  pageCount,
  filterFields,
  initialState,
  manualPagination: false,
  manualSorting: false,
  manualFiltering: false,
  enableRowSelection: true,
  enableUrlState: true,
  debounceMs: 500,
  onFiltersChange: (filters) => console.log(filters),
  onPaginationChange: (pagination) => console.log(pagination),
  onSortingChange: (sorting) => console.log(sorting),
});
```

**Options:**

| Option               | Type                     | Default     | Description                   |
| -------------------- | ------------------------ | ----------- | ----------------------------- |
| `columns`            | `ColumnDef[]`            | Required    | Column definitions            |
| `data`               | `TData[]`                | Required    | Data array                    |
| `pageCount`          | `number`                 | `undefined` | Total pages (for server-side) |
| `filterFields`       | `DataTableFilterField[]` | `undefined` | Filter configuration          |
| `initialState`       | `object`                 | `{}`        | Initial table state           |
| `manualPagination`   | `boolean`                | `false`     | Enable server-side pagination |
| `manualSorting`      | `boolean`                | `false`     | Enable server-side sorting    |
| `manualFiltering`    | `boolean`                | `false`     | Enable server-side filtering  |
| `enableRowSelection` | `boolean`                | `false`     | Enable row selection          |
| `enableUrlState`     | `boolean`                | `true`      | Sync state to URL             |
| `debounceMs`         | `number`                 | `500`       | Debounce delay for filters    |
| `onFiltersChange`    | `function`               | `undefined` | Filter change callback        |
| `onPaginationChange` | `function`               | `undefined` | Pagination change callback    |
| `onSortingChange`    | `function`               | `undefined` | Sorting change callback       |

## Filter Field Types

### Input Filter

Text-based search filter.

```tsx
{
  id: "name",
  label: "Product Name",
  type: "input",
  placeholder: "Search products...",
}
```

### Checkbox Filter

Multi-select dropdown filter.

```tsx
{
  id: "status",
  label: "Status",
  type: "checkbox",
  options: [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ],
}
```

**Column filterFn:**

```tsx
{
  accessorKey: "status",
  filterFn: (row, id, value) => value.includes(row.getValue(id)),
}
```

### Slider Filter

Numeric range filter.

```tsx
{
  id: "price",
  label: "Price Range",
  type: "slider",
  min: 0,
  max: 1000,
  step: 10,
}
```

**Column filterFn:**

```tsx
{
  accessorKey: "price",
  filterFn: (row, id, value) => {
    const price = parseFloat(row.getValue(id));
    const [min, max] = value as [number, number];
    return price >= min && price <= max;
  },
}
```

### Timerange Filter

Date range picker.

```tsx
{
  id: "createdAt",
  label: "Created Date",
  type: "timerange",
  presets: [
    {
      label: "Last 7 days",
      startDate: subDays(new Date(), 7),
      endDate: new Date(),
    },
  ],
}
```

## URL State Format

The table state is encoded in the URL using these parameters:

| Parameter | Format                    | Example                                       |
| --------- | ------------------------- | --------------------------------------------- |
| `page`    | Number (1-indexed)        | `?page=2`                                     |
| `perPage` | Number                    | `?perPage=20`                                 |
| `sort`    | `column.order`            | `?sort=name.asc`                              |
| `filters` | `key:value key:val1,val2` | `?filters=status:active,pending price:10-100` |

**Example URL:**

```
/products?page=1&perPage=10&sort=name.asc&filters=status:active,pending category:Electronics
```

## Server-Side Usage

For server-side data fetching:

```tsx
function ServerDataTable() {
  const [data, setData] = React.useState([]);
  const [pageCount, setPageCount] = React.useState(0);

  const { table } = useDataTable({
    columns,
    data,
    pageCount,
    filterFields,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    onFiltersChange: (filters) => {
      // Fetch data with new filters
      fetchData({ filters });
    },
    onPaginationChange: (pagination) => {
      // Fetch data with new pagination
      fetchData({
        page: pagination.pageIndex + 1,
        perPage: pagination.pageSize,
      });
    },
    onSortingChange: (sorting) => {
      // Fetch data with new sorting
      fetchData({
        sortBy: sorting[0]?.id,
        sortOrder: sorting[0]?.desc ? "desc" : "asc",
      });
    },
  });

  return (
    <>
      <DataTableToolbar table={table} filterFields={filterFields} />
      <DataTable table={table} columns={columns} isLoading={isLoading} />
      <DataTablePagination table={table} />
    </>
  );
}
```

## Advanced Patterns

### Custom Filter Component

```tsx
<DataTableToolbar table={table} filterFields={filterFields}>
  {/* Add custom filters */}
  <DataTableFacetedFilter
    column={table.getColumn("status")}
    title="Status"
    options={statusOptions}
  />
  <DataTableFilterSlider
    column={table.getColumn("price")}
    title="Price"
    min={0}
    max={1000}
  />
</DataTableToolbar>
```

### Disable URL State

For multiple tables on one page:

```tsx
const { table } = useDataTable({
  columns,
  data,
  enableUrlState: false, // Use local state only
});
```

### Custom Initial State

```tsx
const { table } = useDataTable({
  columns,
  data,
  initialState: {
    pagination: { pageIndex: 0, pageSize: 20 },
    sorting: [{ id: "name", desc: false }],
    columnFilters: [{ id: "status", value: ["active"] }],
    columnVisibility: { id: false },
  },
});
```

## TypeScript Types

All types are exported from `@/types/table`:

```tsx
import type {
  DataTableFilterField,
  DataTableConfig,
  Option,
  DatePreset,
  InputFilterField,
  CheckboxFilterField,
  SliderFilterField,
  TimerangeFilterField,
  SheetField,
  SerializedFilters,
} from "@/types/table";
```

## Examples

See `/app/(dashboard)/dashboard/examples/data-table/page.tsx` for a complete working example.

## Credits

Inspired by [openstatusHQ/data-table-filters](https://github.com/openstatusHQ/data-table-filters) with enhancements for this starter kit.
