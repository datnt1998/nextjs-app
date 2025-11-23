# Data Table Components

Comprehensive data table with filtering, sorting, pagination, and URL state management.

## Features

- URL state synchronization
- Compact URL serialization
- Multiple filter types (input, checkbox, slider, timerange)
- Type-safe with TypeScript
- Client and server-side support
- Accessible (Radix UI)
- Customizable

## Quick Start

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
  { accessorKey: "name", header: "Name" },
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
    placeholder: "Search...",
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

Main table component.

```tsx
<DataTable
  table={table}
  columns={columns}
  isLoading={false}
  emptyMessage="No results."
  bordered={true}
/>
```

### DataTableColumnHeader

Sortable column header with dropdown.

```tsx
<DataTableColumnHeader column={column} title="Name" />
```

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

Toolbar with search and filters.

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

Column visibility toggle.

```tsx
<DataTableViewOptions table={table} />
```

## Filter Components

### DataTableFacetedFilter

Multi-select dropdown with badges.

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

### DataTableFilterInput

Text input filter.

```tsx
<DataTableFilterInput
  column={table.getColumn("name")}
  title="Name"
  placeholder="Search..."
/>
```

### DataTableFilterSlider

Numeric range slider.

```tsx
<DataTableFilterSlider
  column={table.getColumn("price")}
  title="Price"
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
  title="Created"
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

Main hook for table instances.

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

**Key Options:**

| Option               | Type      | Default     | Description               |
| -------------------- | --------- | ----------- | ------------------------- |
| `columns`            | Required  | -           | Column definitions        |
| `data`               | Required  | -           | Data array                |
| `pageCount`          | `number`  | `undefined` | Total pages (server-side) |
| `filterFields`       | `array`   | `undefined` | Filter configuration      |
| `manualPagination`   | `boolean` | `false`     | Server-side pagination    |
| `manualSorting`      | `boolean` | `false`     | Server-side sorting       |
| `manualFiltering`    | `boolean` | `false`     | Server-side filtering     |
| `enableRowSelection` | `boolean` | `false`     | Enable row selection      |
| `enableUrlState`     | `boolean` | `true`      | Sync state to URL         |
| `debounceMs`         | `number`  | `500`       | Debounce delay            |

## Filter Field Types

### Input Filter

```tsx
{
  id: "name",
  label: "Name",
  type: "input",
  placeholder: "Search...",
}
```

### Checkbox Filter

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

```tsx
{
  id: "price",
  label: "Price",
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

```tsx
{
  id: "createdAt",
  label: "Created",
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

```
/products?page=2&perPage=10&sort=name.asc&filters=status:active,pending category:Electronics
```

**Parameters:**

- `page` - Current page (1-indexed)
- `perPage` - Items per page
- `sort` - Format: `column.order`
- `filters` - Format: `key:value key:val1,val2`

## Server-Side Usage

```tsx
function ServerDataTable() {
  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(0);

  const { table } = useDataTable({
    columns,
    data,
    pageCount,
    filterFields,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    onFiltersChange: (filters) => fetchData({ filters }),
    onPaginationChange: (pagination) =>
      fetchData({
        page: pagination.pageIndex + 1,
        perPage: pagination.pageSize,
      }),
    onSortingChange: (sorting) =>
      fetchData({
        sortBy: sorting[0]?.id,
        sortOrder: sorting[0]?.desc ? "desc" : "asc",
      }),
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

### Custom Filters

```tsx
<DataTableToolbar table={table} filterFields={filterFields}>
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
  enableUrlState: false,
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

All types exported from `@/types/table`:

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
} from "@/types/table";
```

## Examples

See `/app/(dashboard)/dashboard/examples/data-table/page.tsx` for complete example.

## Credits

Inspired by [openstatusHQ/data-table-filters](https://github.com/openstatusHQ/data-table-filters).
