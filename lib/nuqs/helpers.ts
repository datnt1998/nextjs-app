/**
 * Helper utilities for working with Nuqs URL state
 */

/**
 * Builds a query string from an object of parameters
 * Filters out undefined and null values
 */
export function buildQueryString(
  params: Record<string, string | number | boolean | undefined | null>
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

/**
 * Parses a query string into an object
 */
export function parseQueryString(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};

  params.forEach((value, key) => {
    result[key] = value;
  });

  return result;
}

/**
 * Merges new parameters with existing ones
 * Useful for updating URL state without losing other params
 */
export function mergeParams(
  currentParams: Record<string, string>,
  newParams: Record<string, string | undefined | null>
): Record<string, string> {
  const merged = { ...currentParams };

  Object.entries(newParams).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      delete merged[key];
    } else {
      merged[key] = value;
    }
  });

  return merged;
}

/**
 * Resets pagination to page 1
 * Useful when filters change
 */
export function resetPagination<T extends { page?: number }>(params: T): T {
  return {
    ...params,
    page: 1,
  };
}
