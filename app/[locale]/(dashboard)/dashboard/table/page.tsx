"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import {
  DataTable,
  DataTableColumnHeader,
  DataTableFacetedFilter,
  DataTablePagination,
  DataTableToolbar,
  useDataTable,
} from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DataTableFilterField } from "@/types/table";

// Sample data type
type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
  createdAt: string;
};

// Sample data
const products: Product[] = [
  {
    id: "1",
    name: "Laptop Pro 15",
    category: "Electronics",
    price: 1299.99,
    stock: 45,
    status: "in-stock",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Wireless Mouse",
    category: "Electronics",
    price: 29.99,
    stock: 5,
    status: "low-stock",
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    name: "Office Chair",
    category: "Furniture",
    price: 299.99,
    stock: 0,
    status: "out-of-stock",
    createdAt: "2024-03-10",
  },
  {
    id: "4",
    name: "Desk Lamp",
    category: "Furniture",
    price: 49.99,
    stock: 120,
    status: "in-stock",
    createdAt: "2024-01-25",
  },
  {
    id: "5",
    name: "Notebook Set",
    category: "Stationery",
    price: 14.99,
    stock: 8,
    status: "low-stock",
    createdAt: "2024-02-05",
  },
  {
    id: "6",
    name: "Mechanical Keyboard",
    category: "Electronics",
    price: 159.99,
    stock: 32,
    status: "in-stock",
    createdAt: "2024-03-01",
  },
  {
    id: "7",
    name: 'Monitor 27"',
    category: "Electronics",
    price: 399.99,
    stock: 18,
    status: "in-stock",
    createdAt: "2024-01-30",
  },
  {
    id: "8",
    name: "Standing Desk",
    category: "Furniture",
    price: 599.99,
    stock: 0,
    status: "out-of-stock",
    createdAt: "2024-02-14",
  },
  {
    id: "9",
    name: "Pen Holder",
    category: "Stationery",
    price: 9.99,
    stock: 200,
    status: "in-stock",
    createdAt: "2024-03-05",
  },
  {
    id: "10",
    name: "USB-C Hub",
    category: "Electronics",
    price: 79.99,
    stock: 3,
    status: "low-stock",
    createdAt: "2024-02-28",
  },
];

// Filter field configuration
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
      { label: "In Stock", value: "in-stock" },
      { label: "Low Stock", value: "low-stock" },
      { label: "Out of Stock", value: "out-of-stock" },
    ],
  },
  {
    id: "category",
    label: "Category",
    type: "checkbox",
    options: [
      { label: "Electronics", value: "Electronics" },
      { label: "Furniture", value: "Furniture" },
      { label: "Stationery", value: "Stationery" },
    ],
  },
  {
    id: "price",
    label: "Price Range",
    type: "slider",
    min: 0,
    max: 1000,
    step: 10,
  },
];

export default function DataTableExamplePage() {
  // Column definitions
  const columns: ColumnDef<Product>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Product" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
      cell: ({ row }) => <div>{row.getValue("category")}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Price" />
      ),
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(price);
        return <div className="font-medium">{formatted}</div>;
      },
      filterFn: (row, id, value) => {
        const price = parseFloat(row.getValue(id));
        const [min, max] = value as [number, number];
        return price >= min && price <= max;
      },
    },
    {
      accessorKey: "stock",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Stock" />
      ),
      cell: ({ row }) => <div>{row.getValue("stock")}</div>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variant =
          status === "in-stock"
            ? "default"
            : status === "low-stock"
              ? "secondary"
              : "destructive";
        return (
          <Badge variant={variant}>
            {status === "in-stock"
              ? "In Stock"
              : status === "low-stock"
                ? "Low Stock"
                : "Out of Stock"}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created" />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return <div>{date.toLocaleDateString()}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(product.id)}
              >
                Copy product ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Edit product</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Initialize data table
  const { table } = useDataTable({
    columns,
    data: products,
    filterFields,
    pageCount: Math.ceil(products.length / 5),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 5,
      },
    },
  });

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Data Table Example</CardTitle>
          <CardDescription>
            Advanced data table with filters, sorting, pagination, density
            control, and URL state management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DataTableToolbar table={table} filterFields={filterFields}>
            <DataTableFacetedFilter
              column={table.getColumn("status")}
              title="Status"
              options={
                filterFields.find((f) => f.id === "status")?.type === "checkbox"
                  ? (filterFields.find((f) => f.id === "status") as any).options
                  : []
              }
            />
            <DataTableFacetedFilter
              column={table.getColumn("category")}
              title="Category"
              options={
                filterFields.find((f) => f.id === "category")?.type ===
                "checkbox"
                  ? (filterFields.find((f) => f.id === "category") as any)
                      .options
                  : []
              }
            />
          </DataTableToolbar>

          <DataTable
            table={table}
            columns={columns}
            isLoading={false}
            emptyMessage="No products found."
          />

          <DataTablePagination table={table} />
        </CardContent>
      </Card>

      {/* Feature highlights */}
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">URL State Sync</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              All filters, sorting, and pagination are automatically synced to
              the URL. Try filtering or sorting, then refresh the page.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Density Control</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Adjust table spacing with three density levels: Compact,
              Comfortable, and Spacious.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Compact URL Format</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Filters are serialized using a compact format:{" "}
              <code className="text-xs">status:in-stock,low-stock</code>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
