"use client";

import Link from "next/link";
import { use } from "react";
import { Icons } from "@/components/icons/registry";
import { ItemForm } from "@/components/items/item-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Stack } from "@/components/ui/stack";
import { useItem } from "@/hooks/use-items";
import type { Database } from "@/types/database.types";

type Item = Database["public"]["Tables"]["items"]["Row"];

interface ItemEditPageProps {
  params: Promise<{ id: string }>;
}

export default function ItemEditPage({ params }: ItemEditPageProps) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

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
        <Card variant="outline">
          <CardContent className="py-12 text-center">
            <p className="mb-4 text-danger">
              {error ? "Failed to load item." : "Item not found."}
            </p>
            <Link href="/dashboard/items">
              <Button variant="outline">Back to Items</Button>
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
        <Link href={`/dashboard/items/${item.id}`}>
          <Button variant="outline" size="sm">
            <Icons.chevronDown className="mr-2 h-4 w-4 rotate-90" />
            Back to Item
          </Button>
        </Link>

        {/* Form */}
        <ItemForm item={item} mode="edit" />
      </Stack>
    </Container>
  );
}
