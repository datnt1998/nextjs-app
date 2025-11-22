import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { Locale } from "@/i18n/config";
import { generateI18nMetadata } from "@/lib/i18n/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.errors.403" });

  return generateI18nMetadata({
    locale: locale as Locale,
    pathname: "/403",
    title: t("title"),
    description: t("description"),
  });
}

export default async function ForbiddenPage() {
  const t = await getTranslations("errors.403");

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-danger/10">
            <span className="text-4xl font-bold text-danger">403</span>
          </div>
          <h1 className="text-2xl font-semibold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/">{t("goHome")}</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">{t("returnToDashboard")}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
