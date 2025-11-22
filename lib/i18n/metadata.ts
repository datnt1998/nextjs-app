import type { Metadata } from "next";
import { getSiteName, siteConfig } from "@/config/site";
import { type Locale, locales } from "@/i18n/config";

/**
 * Generates hreflang alternate links for all supported locales
 * @param pathname - The current page path without locale prefix (e.g., "/dashboard", "/items")
 * @returns Object with language alternates for metadata
 */
export function generateHreflangLinks(pathname: string) {
  const languages: Record<string, string> = {};

  for (const locale of locales) {
    // Construct full URL with locale prefix
    const url = `${siteConfig.url}/${locale}${pathname}`;
    languages[locale] = url;
  }

  return languages;
}

/**
 * Generates locale-aware metadata with hreflang tags and Open Graph locale
 * @param locale - Current locale
 * @param pathname - Current page path without locale prefix
 * @param title - Page title (already translated)
 * @param description - Page description (already translated)
 * @param additionalMetadata - Additional metadata to merge
 * @returns Complete metadata object with i18n support
 */
export function generateI18nMetadata({
  locale,
  pathname,
  title,
  description,
  additionalMetadata = {},
}: {
  locale: Locale;
  pathname: string;
  title: string;
  description: string;
  additionalMetadata?: Partial<Metadata>;
}): Metadata {
  // Get alternate locales (all locales except current)
  const alternateLocales = locales.filter((l) => l !== locale);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale: locale,
      alternateLocale: alternateLocales,
      url: `${siteConfig.url}/${locale}${pathname}`,
      siteName: getSiteName(locale),
      type: "website",
      ...additionalMetadata.openGraph,
    },
    alternates: {
      languages: generateHreflangLinks(pathname),
      ...additionalMetadata.alternates,
    },
    ...additionalMetadata,
  };
}
