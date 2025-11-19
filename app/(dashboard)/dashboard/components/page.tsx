import type { Metadata } from "next";
import { ComponentShowcase } from "@/components/features/component-showcase/component-showcase";

export const metadata: Metadata = {
  title: "Component Gallery",
  description: "A curated showcase of all UI components in the design system",
};

export default function ComponentsPage() {
  return <ComponentShowcase />;
}
