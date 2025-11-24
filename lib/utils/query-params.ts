/**
 * Utility functions for cleaning and optimizing query parameters
 */

/**
 * Remove filter if all options are selected (no need to filter)
 * @param selected - Selected values
 * @param allOptions - All possible values
 * @returns Selected values or undefined if all are selected
 */
export function optimizeFilter<T>(
  selected: T[] | undefined,
  allOptions: T[]
): T[] | undefined {
  if (!selected || selected.length === 0) {
    return undefined;
  }

  // If all options are selected, no need to filter
  if (selected.length === allOptions.length) {
    return undefined;
  }

  return selected;
}

/**
 * Clean query params by removing undefined, null, empty strings, and empty arrays
 */
export function cleanQueryParams<T extends Record<string, unknown>>(
  params: T
): Partial<T> {
  return Object.entries(params).reduce((acc, [key, value]) => {
    // Skip undefined, null, empty string, or empty array
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return acc;
    }

    acc[key as keyof T] = value as T[keyof T];
    return acc;
  }, {} as Partial<T>);
}
