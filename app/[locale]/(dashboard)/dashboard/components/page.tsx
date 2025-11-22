import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ComponentShowcase } from "@/components/features/component-showcase/component-showcase";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "components" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function ComponentsPage() {
  return <ComponentShowcase />;
}
