import type { locales } from "@/i18n/config";

export type Locale = (typeof locales)[number];

export type Messages = {
  common: typeof import("../messages/en/common.json");
  auth: typeof import("../messages/en/auth.json");
  dashboard: typeof import("../messages/en/dashboard.json");
  items: typeof import("../messages/en/items.json");
  navigation: typeof import("../messages/en/navigation.json");
  errors: typeof import("../messages/en/errors.json");
  metadata: typeof import("../messages/en/metadata.json");
};

declare global {
  interface IntlMessages extends Messages {}
}
