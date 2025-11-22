"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { use } from "react";
import { ItemForm } from "@/components/features/items/item-form";
import { Icons } from "@/components/icons/registry";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Stack } from "@/components/ui/stack";
import { useItem } from "@/hooks/use-items";
import type { Database } from "@/types/database.types";

type Item = Database["public"]["Tables"]["items"]["Row"];

interface ItemEditPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default function ItemEditPage({ params }: ItemEditPageProps) {
  const resolvedParams = use(params);
  const { id, locale } = resolvedParams;
  const t = useTranslations("items");

  // Fetch item
  const { data, isLoading, error } = useItem(id);
  const item = data as Item | undefined;

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
        <Link href={`/${locale}/dashboard/items/${item.id}`}>
          <Button variant="outline" size="sm">
            <Icons.chevronDown className="mr-2 h-4 w-4 rotate-90" />
            {t("actions.backToItem")}
          </Button>
        </Link>

        {/* Form */}
        <ItemForm item={item} mode="edit" />
      </Stack>
    </Container>
  );
}
