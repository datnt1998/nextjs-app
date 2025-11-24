"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { DataTableColumnHeader } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Item } from "@/lib/api/items";

interface ItemsTableColumnsProps {
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export function getItemsTableColumns({
  onEdit,
  onDelete,
}: ItemsTableColumnsProps): ColumnDef<Item>[] {
  return [
    {
      accessorKey: "search",
      header: () => null,
      cell: () => null,
      enableSorting: true,
      enableHiding: true,
    },
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
      accessorKey: "image_url",
      header: () => {
        const t = useTranslations("items.table.columns");
        return t("image");
      },
      cell: ({ row }) => {
        const imageUrl = row.getValue("image_url") as string | null;
        return imageUrl ? (
          <div className="relative h-10 w-10 overflow-hidden rounded-md">
            <Image
              src={imageUrl}
              alt={row.getValue("title")}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
        ) : (
          <div className="h-10 w-10 rounded-md bg-muted" />
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => {
        const t = useTranslations("items.table.columns");
        return <DataTableColumnHeader column={column} title={t("title")} />;
      },
      cell: ({ row }) => {
        return (
          <div className="max-w-[300px] truncate font-medium">
            {row.getValue("title")}
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: () => {
        const t = useTranslations("items.table.columns");
        return t("description");
      },
      cell: ({ row }) => {
        const description = row.getValue("description") as string | null;
        return description ? (
          <div className="max-w-[400px] truncate text-muted-foreground">
            {description}
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        const t = useTranslations("items.table.columns");
        return <DataTableColumnHeader column={column} title={t("status")} />;
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const t = useTranslations("items.filters");

        const statusConfig = {
          active: { label: t("active"), variant: "default" as const },
          inactive: { label: t("inactive"), variant: "secondary" as const },
          archived: { label: t("archived"), variant: "outline" as const },
        };

        const config = statusConfig[status as keyof typeof statusConfig];

        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        const t = useTranslations("items.table.columns");
        return <DataTableColumnHeader column={column} title={t("created")} />;
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return (
          <div className="text-muted-foreground">
            {format(date, "MMM d, yyyy")}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => {
        const t = useTranslations("items.table.columns");
        return t("actions");
      },
      cell: ({ row }) => {
        const item = row.original;
        const t = useTranslations("items");

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {t("table.columns.actions")}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(item)}>
                <Pencil className="mr-2 h-4 w-4" />
                {t("form.editTitle")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(item)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t("delete.title")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];
}
