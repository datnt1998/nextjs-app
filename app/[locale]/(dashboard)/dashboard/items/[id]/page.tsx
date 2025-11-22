"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { use, useState } from "react";
import { toast } from "sonner";
import { Icons } from "@/components/icons/registry";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Stack } from "@/components/ui/stack";
import { useDeleteItem, useItem } from "@/hooks/use-items";
import { buildImageUrl } from "@/lib/imagekit/url-builder";
import { canPerformAction, PERMISSIONS } from "@/lib/rbac/permissions";
import { useUserStore } from "@/stores/user.store";
import type { Database } from "@/types/database.types";

type Item = Database["public"]["Tables"]["items"]["Row"];

interface ItemDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default function ItemDetailPage({ params }: ItemDetailPageProps) {
  const resolvedParams = use(params);
  const { id, locale } = resolvedParams;
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const deleteItem = useDeleteItem();
  const t = useTranslations("items");
  const tCommon = useTranslations("common");

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch item
  const { data, isLoading, error } = useItem(id);
  const item = data as Item | undefined;

  // Check if user can edit/delete this item
  const userProfile = user
    ? {
        id: user.id,
        role: user.role,
        permissions: user.permissions,
        tenant_id: user.tenant_id,
      }
    : null;

  const canEdit = item
    ? canPerformAction(userProfile, PERMISSIONS.ITEMS_UPDATE_ANY, item.user_id)
    : false;

  const canDelete = item
    ? canPerformAction(userProfile, PERMISSIONS.ITEMS_DELETE_ANY, item.user_id)
    : false;

  const handleDelete = async () => {
    if (!item) return;

    setIsDeleting(true);
    try {
      await deleteItem.mutateAsync(item.id);
      toast.success(t("delete.success"));
      router.push(`/${locale}/dashboard/items`);
    } catch (error) {
      toast.error(t("errors.deleteFailed"), {
        description:
          error instanceof Error ? error.message : tCommon("messages.error"),
      });
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <Container size="lg" className="py-8">
        <div className="flex items-center justify-center py-12">
          <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Container>
    );
  }

  // Error State
  if (error || !item) {
    return (
      <Container size="lg" className="py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="mb-4 text-danger">
              {error ? t("errors.loadFailed") : t("errors.itemNotFound")}
            </p>
            <Link href={`/${locale}/dashboard/items`}>
              <Button variant="outline">{t("actions.backToItems")}</Button>
            </Link>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container size="lg" className="py-8">
      <Stack direction="vertical" gap="lg">
        {/* Header */}
        <Stack direction="horizontal" justify="between" align="center">
          <Link href={`/${locale}/dashboard/items`}>
            <Button variant="outline" size="sm">
              <Icons.chevronDown className="mr-2 h-4 w-4 rotate-90" />
              {t("actions.backToItems")}
            </Button>
          </Link>
          <Stack direction="horizontal" gap="sm">
            {canEdit && (
              <Link href={`/${locale}/dashboard/items/${item.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Icons.settings className="mr-2 h-4 w-4" />
                  {tCommon("actions.edit")}
                </Button>
              </Link>
            )}
            {canDelete && (
              <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Icons.trash className="mr-2 h-4 w-4" />
                    {tCommon("actions.delete")}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("delete.title")}</DialogTitle>
                    <DialogDescription>
                      {t("delete.description", { title: item.title })}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDeleteDialogOpen(false)}
                      disabled={isDeleting}
                    >
                      {t("delete.cancel")}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          {t("delete.deleting")}
                        </>
                      ) : (
                        t("delete.confirm")
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </Stack>
        </Stack>

        {/* Item Details */}
        <Card>
          <CardContent className="pt-6">
            <Stack direction="vertical" gap="lg">
              {/* Image */}
              {item.image_url && (
                <div className="relative h-96 w-full overflow-hidden rounded-lg">
                  <img
                    src={buildImageUrl(item.image_url, {
                      width: 1200,
                      height: 800,
                      crop: "maintain_ratio",
                      quality: 90,
                      format: "auto",
                    })}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              {/* Title and Status */}
              <Stack direction="horizontal" justify="between" align="start">
                <div>
                  <h1 className="mb-2 text-3xl font-bold">{item.title}</h1>
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                      item.status === "active"
                        ? "bg-success/10 text-success"
                        : item.status === "inactive"
                          ? "bg-warning/10 text-warning"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </Stack>

              {/* Description */}
              {item.description && (
                <div>
                  <h2 className="mb-2 text-lg font-semibold">
                    {t("detail.description")}
                  </h2>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              )}

              {/* Metadata */}
              <div className="grid grid-cols-1 gap-4 rounded-lg border border-border p-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("detail.created")}
                  </p>
                  <p className="text-sm">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("detail.lastUpdated")}
                  </p>
                  <p className="text-sm">
                    {new Date(item.updated_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("detail.itemId")}
                  </p>
                  <p className="text-sm font-mono">{item.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("detail.ownerId")}
                  </p>
                  <p className="text-sm font-mono">{item.user_id}</p>
                </div>
              </div>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
