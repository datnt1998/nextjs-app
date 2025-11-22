import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "./config";

// Cookie name for storing locale preference
export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  // Configure locale detection to use cookies
  localeDetection: true,
});

// Create navigation utilities with proper locale handling
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
