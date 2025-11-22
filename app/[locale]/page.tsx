import { redirect } from "next/navigation";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Redirect to dashboard as the default page
  redirect(`/${locale}/dashboard`);
}
