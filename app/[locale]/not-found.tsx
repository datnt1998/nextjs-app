"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function NotFound() {
  const locale = useLocale();
  const t = useTranslations("errors");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">{t("notFound.title")}</h2>
      <p className="mt-2 text-muted-foreground">{t("notFound.description")}</p>
      <Link
        href={`/${locale || "en"}`}
        className="mt-8 rounded-lg bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90"
      >
        {t("notFound.goHome")}
      </Link>
    </div>
  );
}
