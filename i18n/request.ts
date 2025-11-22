import { getRequestConfig } from "next-intl/server";
import { defaultLocale, locales } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as any)) {
    locale = defaultLocale;
  }

  // Load all message namespaces
  const messages = {
    common: (await import(`../messages/${locale}/common.json`)).default,
    auth: (await import(`../messages/${locale}/auth.json`)).default,
    dashboard: (await import(`../messages/${locale}/dashboard.json`)).default,
    items: (await import(`../messages/${locale}/items.json`)).default,
    navigation: (await import(`../messages/${locale}/navigation.json`)).default,
    errors: (await import(`../messages/${locale}/errors.json`)).default,
    metadata: (await import(`../messages/${locale}/metadata.json`)).default,
    users: (await import(`../messages/${locale}/users.json`)).default,
    settings: (await import(`../messages/${locale}/settings.json`)).default,
    table: (await import(`../messages/${locale}/table.json`)).default,
    upload: (await import(`../messages/${locale}/upload.json`)).default,
    components: (await import(`../messages/${locale}/components.json`)).default,
  };

  return {
    locale,
    messages,
    timeZone: "UTC",
    now: new Date(),
  };
});
