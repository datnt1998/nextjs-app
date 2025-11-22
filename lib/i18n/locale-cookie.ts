import type { Locale } from "@/i18n/config";
import { locales } from "@/i18n/config";
import { LOCALE_COOKIE_NAME } from "@/i18n/routing";

/**
 * Cookie configuration for locale persistence
 */
export const LOCALE_COOKIE_CONFIG = {
  name: LOCALE_COOKIE_NAME,
  maxAge: 60 * 60 * 24 * 365, // 1 year
  path: "/",
  sameSite: "lax" as const,
};

/**
 * Set the locale preference cookie (client-side)
 * @param locale - The locale to set
 */
export function setLocaleCookie(locale: Locale): void {
  if (typeof document === "undefined") {
    throw new Error("setLocaleCookie can only be called on the client side");
  }

  document.cookie = `${LOCALE_COOKIE_CONFIG.name}=${locale}; path=${LOCALE_COOKIE_CONFIG.path}; max-age=${LOCALE_COOKIE_CONFIG.maxAge}; SameSite=${LOCALE_COOKIE_CONFIG.sameSite}`;
}

/**
 * Get the locale preference from cookies (client-side)
 * @returns The stored locale or null if not found
 */
export function getLocaleCookie(): Locale | null {
  if (typeof document === "undefined") {
    return null;
  }

  const cookies = document.cookie.split("; ");
  const localeCookie = cookies.find((cookie) =>
    cookie.startsWith(`${LOCALE_COOKIE_CONFIG.name}=`),
  );

  if (!localeCookie) {
    return null;
  }

  const locale = localeCookie.split("=")[1];
  return locales.includes(locale as Locale) ? (locale as Locale) : null;
}

/**
 * Clear the locale preference cookie (client-side)
 */
export function clearLocaleCookie(): void {
  if (typeof document === "undefined") {
    throw new Error("clearLocaleCookie can only be called on the client side");
  }

  document.cookie = `${LOCALE_COOKIE_CONFIG.name}=; path=${LOCALE_COOKIE_CONFIG.path}; max-age=0`;
}
