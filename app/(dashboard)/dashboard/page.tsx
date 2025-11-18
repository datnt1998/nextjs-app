import { Icons } from "@/components/icons/registry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Grid } from "@/components/ui/grid";
import { Stack } from "@/components/ui/stack";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
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
            Welcome back, {fullName}!
          </h2>
          <p className="text-muted-foreground">
            Here's what's happening with your projects today.
          </p>
        </Stack>

        {/* Overview Cards with Stats */}
        <Grid cols={4} gap="md">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Icons.folder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{itemsCount || 0}</div>
              <p className="text-xs text-muted-foreground">
                {itemsCount === 0
                  ? "No items created yet"
                  : `+${itemsCount} from last month`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <Icons.users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usersCount || 0}</div>
              <p className="text-xs text-muted-foreground">
                {usersCount === 1
                  ? "You are the first user"
                  : `${usersCount} registered users`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <Icons.folder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Start your first project
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion</CardTitle>
              <Icons.settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0%</div>
              <p className="text-xs text-muted-foreground">
                No tasks completed
              </p>
            </CardContent>
          </Card>
        </Grid>

        {/* Additional Overview Sections */}
        <Grid cols={12} gap="md">
          <Card className="col-span-12 lg:col-span-8">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Stack direction="vertical" gap="md">
                <p className="text-sm text-muted-foreground">
                  Your dashboard overview will appear here. This is a
                  placeholder for charts and analytics.
                </p>
                <div className="h-[200px] rounded-md border border-dashed border-border flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    Chart placeholder
                  </p>
                </div>
              </Stack>
            </CardContent>
          </Card>

          <Card className="col-span-12 lg:col-span-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Stack direction="vertical" gap="sm">
                {itemsCount === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No recent activity to display.
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {itemsCount} items created
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
