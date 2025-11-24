"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import type { Item } from "@/lib/api/items";
import type { DatatableParams } from "@/types/params";
import { ItemDeleteDialog } from "./item-delete-dialog";
import { ItemFormDialog } from "./item-form-dialog";
import ItemsTable from "./items-table";

interface ItemsPageProps {
  params: DatatableParams;
}

export function ItemsPage({ params }: ItemsPageProps) {
  const t = useTranslations("items");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleCreateNew = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        actions={
          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            {t("actions.createItem")}
          </Button>
        }
      />

      {/* Items Table */}
      <ItemsTable params={params} />

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
