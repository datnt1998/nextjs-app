/**
 * Delimiters for URL filter serialization
 * Based on openstatusHQ's compact URL encoding pattern
 */

export const DELIMITERS = {
  /** Separates multiple filters: "status:active priority:high" */
  FILTER: " ",
  /** Separates key from value: "status:active" */
  KEY_VALUE: ":",
  /** Separates multiple values in array filters: "active,pending,completed" */
  ARRAY: ",",
  /** Separates range values (min/max): "10-100" */
  RANGE: "-",
  /** Separates date range values: "2024-01-01_2024-12-31" */
  DATE_RANGE: "_",
} as const;
