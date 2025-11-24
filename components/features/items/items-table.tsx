"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import React from "react";

import { toast } from "sonner";
import {
  DataTable,
  DataTableFacetedFilter,
  DataTablePagination,
  DataTableToolbar,
  useDataTable,
} from "@/components/shared/data-table";
import { useDeleteItem, useItems } from "@/hooks/use-items";
import type { Item } from "@/lib/api/items";
import { optimizeFilter } from "@/lib/utils/query-params";
import type { DatatableParams } from "@/types/params";
import type { DataTableFilterField } from "@/types/table";
import { getItemsTableColumns } from "./items-table-columns";

interface ItemsTableProps {
  params: DatatableParams;
}

export default function ItemsTable({ params }: ItemsTableProps) {
  const { push } = useRouter();
  const t = useTranslations("items");

  // Queries
  const allStatuses = ["active", "inactive", "archived"] as const;
  const statusFilter = params.status as
    | ("active" | "inactive" | "archived")[]
    | undefined;

  const {
    data: itemsData,
    isLoading,
    isError,
    error,
  } = useItems({
    page: params.page,
    limit: params.pageSize,
    search: params.search || undefined,
    status: optimizeFilter(statusFilter, [...allStatuses]),
  });
  const { mutateAsync: deleteItem } = useDeleteItem();

  // Safely extract data with fallbacks
  const items = (itemsData?.items || []) as Item[];
  const totalPages = itemsData
    ? Math.ceil(itemsData.total / (itemsData.limit || 10))
    : 0;

  // Columns with actions
  const columns = React.useMemo(() => {
    return getItemsTableColumns({
      onEdit: (item) => {
        push(`/dashboard/items/${item.id}/edit`);
      },
      onDelete: (item) => {
        toast.promise(deleteItem(item.id), {
          loading: t("delete.deleting"),
          success: t("delete.success"),
          error: t("errors.deleteFailed"),
        });
      },
    });
  }, [push, deleteItem, t]);

  // Filter fields configuration
  const filterFields: DataTableFilterField<Item>[] = [
    {
      id: "search",
      type: "input",
      label: t("search.searchByTitle"),
      placeholder: t("search.placeholder"),
    },
    {
      id: "status",
      type: "checkbox",
      label: t("filters.title"),
      options: [
        { label: t("filters.active"), value: "active" },
        { label: t("filters.inactive"), value: "inactive" },
        { label: t("filters.archived"), value: "archived" },
      ],
    },
  ];

  // Initialize data table
  const { table } = useDataTable({
    data: items,
    columns,
    pageCount: totalPages,
    filterFields,
    enableAdvancedFilter: false,
    initialState: {
      sorting: [{ id: "created_at", desc: true }],
      columnVisibility: {
        title: false,
      },
      columnPinning: { right: ["actions"] },
    },
    shallow: false,
    scroll: true,
    clearOnDefault: true,
  });

  // Determine what text to show in the table
  let tableText = t("table.noResults");
  if (isLoading) {
    tableText = t("common.loading") || "Loading...";
  } else if (isError) {
    tableText = error?.message || t("common.error") || "An error occurred";
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <DataTableToolbar table={table} filterFields={filterFields}>
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

      {/* Table */}
      <DataTable
        table={table}
        columns={columns}
        isLoading={isLoading}
        emptyMessage={tableText}
      />

      {/* Pagination */}
      <DataTablePagination table={table} />
    </div>
  );
}
