import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Icons } from "@/components/icons/registry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Grid } from "@/components/ui/grid";
import { Stack } from "@/components/ui/stack";
import type { Locale } from "@/i18n/config";
import { generateI18nMetadata } from "@/lib/i18n/metadata";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.dashboard" });

  return generateI18nMetadata({
    locale: locale as Locale,
    pathname: "/dashboard",
    title: t("title"),
    description: t("description"),
  });
}

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get user profile for full name
  let fullName = user?.email?.split("@")[0] || "User";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    if (profile?.full_name) {
      fullName = profile.full_name;
    }
  }

  // Get stats
  const { count: itemsCount } = await supabase
    .from("items")
    .select("*", { count: "exact", head: true });

  const { count: usersCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  return (
    <Container size="full">
      <Stack direction="vertical" gap="lg">
        {/* Welcome Message */}
        <Stack direction="vertical" gap="sm">
          <h2 className="text-3xl font-bold tracking-tight">
            {t("welcome", { name: fullName })}
          </h2>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </Stack>

        {/* Overview Cards with Stats */}
        <Grid cols={4} gap="md">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("stats.totalItems")}
              </CardTitle>
              <Icons.folder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{itemsCount || 0}</div>
              <p className="text-xs text-muted-foreground">
                {itemsCount === 0
                  ? t("stats.noItemsYet")
                  : t("stats.itemsFromLastMonth", { count: itemsCount ?? 0 })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("stats.activeUsers")}
              </CardTitle>
              <Icons.users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usersCount || 0}</div>
              <p className="text-xs text-muted-foreground">
                {usersCount === 1
                  ? t("stats.firstUser")
                  : t("stats.registeredUsers", { count: usersCount ?? 0 })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("stats.projects")}
              </CardTitle>
              <Icons.folder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                {t("stats.startFirstProject")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("stats.completion")}
              </CardTitle>
              <Icons.settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0%</div>
              <p className="text-xs text-muted-foreground">
                {t("stats.noTasksCompleted")}
              </p>
            </CardContent>
          </Card>
        </Grid>

        {/* Additional Overview Sections */}
        <Grid cols={12} gap="md">
          <Card className="col-span-12 lg:col-span-8">
            <CardHeader>
              <CardTitle>{t("overview.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Stack direction="vertical" gap="md">
                <p className="text-sm text-muted-foreground">
                  {t("overview.subtitle")}
                </p>
                <div className="h-[200px] rounded-md border border-dashed border-border flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    {t("overview.chartPlaceholder")}
                  </p>
                </div>
              </Stack>
            </CardContent>
          </Card>

          <Card className="col-span-12 lg:col-span-4">
            <CardHeader>
              <CardTitle>{t("recentActivity.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Stack direction="vertical" gap="sm">
                {itemsCount === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {t("recentActivity.noActivity")}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {t("recentActivity.itemsCreated", {
                      count: itemsCount ?? 0,
                    })}
                  </p>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Stack>
    </Container>
  );
}
