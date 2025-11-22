import { getTranslations } from "next-intl/server";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ImageUploadForm } from "@/components/features/upload/image-upload-form";
import { Container } from "@/components/ui/container";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "upload" });

  return {
    title: `${t("title")} | Dashboard`,
    description: t("subtitle"),
  };
}

export default async function UploadPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "upload" });

  return (
    <DashboardShell>
      <Container size="lg">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
            <p className="text-muted-foreground mt-2">{t("subtitle")}</p>
          </div>

          <ImageUploadForm folder="/uploads" maxSizeMB={10} />
        </div>
      </Container>
    </DashboardShell>
  );
}
