/**
 * Navigation utility functions for handling locale-aware routing
 */

/**
 * Remove locale prefix from pathname
 * @param pathname - Full pathname with locale (e.g., /en/dashboard/items)
 * @returns Pathname without locale (e.g., /dashboard/items)
 *
 * @example
 * removeLocaleFromPathname("/en/dashboard") // "/dashboard"
 * removeLocaleFromPathname("/vi/dashboard/items") // "/dashboard/items"
 * removeLocaleFromPathname("/en") // "/"
 */
export function removeLocaleFromPathname(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  // First segment is locale, remove it
  const pathWithoutLocale = segments.slice(1);
  return pathWithoutLocale.length > 0 ? `/${pathWithoutLocale.join("/")}` : "/";
}

/**
 * Check if a pathname matches a href (ignoring locale)
 * @param pathname - Current pathname with locale
 * @param href - Target href without locale
 * @param exact - Whether to match exactly or allow prefix matching
 * @returns True if pathname matches href
 *
 * @example
 * isPathnameActive("/en/dashboard", "/dashboard", true) // true
 * isPathnameActive("/en/dashboard/items", "/dashboard", false) // true
 * isPathnameActive("/en/dashboard/items", "/dashboard", true) // false
 */
export function isPathnameActive(
  pathname: string,
  href: string,
  exact = true
): boolean {
  const pathnameWithoutLocale = removeLocaleFromPathname(pathname);
  const cleanPathname = pathnameWithoutLocale.split("?")[0];
  const cleanHref = href.split("?")[0];

  if (exact) {
    return cleanPathname === cleanHref;
  }

  // Prefix matching
  return (
    cleanPathname === cleanHref || cleanPathname.startsWith(`${cleanHref}/`)
  );
}

/**
 * Get path segments without locale
 * @param pathname - Full pathname with locale
 * @returns Array of path segments without locale
 *
 * @example
 * getPathSegmentsWithoutLocale("/en/dashboard/items") // ["dashboard", "items"]
 * getPathSegmentsWithoutLocale("/vi/settings") // ["settings"]
 */
export function getPathSegmentsWithoutLocale(pathname: string): string[] {
  const segments = pathname.split("/").filter(Boolean);
  return segments.slice(1); // Remove locale (first segment)
}
