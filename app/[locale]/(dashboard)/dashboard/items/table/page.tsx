"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import { useMemo, useState } from "react";
import { ItemDeleteDialog } from "@/components/features/items/item-delete-dialog";
import { ItemFormDialog } from "@/components/features/items/item-form-dialog";
import { getItemsTableColumns } from "@/components/features/items/items-table-columns";
import {
  DataTable,
  DataTableFacetedFilter,
  DataTablePagination,
  DataTableToolbar,
  useDataTable,
} from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import type { Item } from "@/lib/api/items";
import { fetchItems } from "@/lib/api/items";
import { itemsKeys } from "@/lib/query-keys/items";
import type { DataTableFilterField } from "@/types/table";

export default function ItemsTablePage() {
  const t = useTranslations("items");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // URL state management
  const [urlState] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),
    search: parseAsString.withDefault(""),
    status: parseAsString.withDefault(""),
    sortBy: parseAsString.withDefault("created_at"),
    sortOrder: parseAsStringEnum(["asc", "desc"]).withDefault("desc"),
  });

  // Parse status filter
  const statusFilter = useMemo(
    () => (urlState.status ? urlState.status.split(",") : []),
    [urlState.status]
  );

  // Fetch items with React Query
  const { data, isLoading } = useQuery({
    queryKey: itemsKeys.list({
      page: urlState.page,
      limit: urlState.perPage,
      search: urlState.search,
      status: statusFilter,
    }),
    queryFn: () =>
      fetchItems({
        page: urlState.page,
        limit: urlState.perPage,
        search: urlState.search,
        status: statusFilter,
        sortBy: urlState.sortBy,
        sortOrder: urlState.sortOrder,
      }),
  });

  // Filter fields configuration
  const filterFields: DataTableFilterField<Item>[] = useMemo(
    () => [
      {
        id: "title",
        label: t("search.searchByTitle"),
        type: "input",
        placeholder: t("search.placeholder"),
      },
      {
        id: "status",
        label: t("filters.title"),
        type: "checkbox",
        options: [
          { label: t("filters.active"), value: "active" },
          { label: t("filters.inactive"), value: "inactive" },
          { label: t("filters.archived"), value: "archived" },
        ],
      },
    ],
    [t]
  );

  // Table columns with action handlers
  const columns = useMemo(
    () =>
      getItemsTableColumns({
        onEdit: (item) => {
          setSelectedItem(item);
          setIsFormOpen(true);
        },
        onDelete: (item) => {
          setSelectedItem(item);
          setIsDeleteOpen(true);
        },
      }),
    []
  );

  // Initialize data table
  const { table, density, setDensity } = useDataTable({
    columns,
    data: data?.items || [],
    pageCount: data ? Math.ceil(data.total / urlState.perPage) : 0,
    filterFields,
    enableRowSelection: true,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  const handleCreateNew = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("table.title")}
          </h1>
          <p className="text-muted-foreground">{t("table.subtitle")}</p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          {t("actions.createItem")}
        </Button>
      </div>

      {/* Data Table */}
      <div className="space-y-4">
        <DataTableToolbar
          table={table}
          filterFields={filterFields}
          density={density}
          onDensityChange={setDensity}
        >
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title={t("filters.title")}
            options={[
              { label: t("filters.active"), value: "active" },
              { label: t("filters.inactive"), value: "inactive" },
              { label: t("filters.archived"), value: "archived" },
            ]}
          />
        </DataTableToolbar>

        <DataTable
          table={table}
          columns={columns}
          isLoading={isLoading}
          emptyMessage={t("table.noResults")}
          density={density}
        />

        <DataTablePagination table={table} />
      </div>

      {/* Dialogs */}
      <ItemFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        item={selectedItem}
      />

      <ItemDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        item={selectedItem}
      />
    </div>
  );
}
