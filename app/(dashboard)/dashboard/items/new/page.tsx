"use client";

import Link from "next/link";
import { ItemForm } from "@/components/features/items/item-form";
import { Icons } from "@/components/icons/registry";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Stack } from "@/components/ui/stack";

export default function NewItemPage() {
  return (
    <Container size="lg" className="py-8">
      <Stack direction="vertical" gap="lg">
        {/* Header */}
        <Link href="/dashboard/items">
          <Button variant="outline" size="sm">
            <Icons.chevronDown className="mr-2 h-4 w-4 rotate-90" />
            Back to Items
          </Button>
        </Link>

        {/* Form */}
        <ItemForm mode="create" />
      </Stack>
    </Container>
  );
}
