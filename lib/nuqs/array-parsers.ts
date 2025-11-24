import { parseAsArrayOf, parseAsString } from "nuqs/server";

/**
 * Common array parsers for URL query parameters
 */

/**
 * Parse comma-separated string array from URL
 * Example: ?status=active,inactive -> ["active", "inactive"]
 */
export const parseAsStringArray = parseAsArrayOf(parseAsString, ",");

/**
 * Parse comma-separated string array with default value
 * @param defaultValue - Default array value
 */
export const createStringArrayParser = (defaultValue: string[] = []) =>
  parseAsStringArray.withDefault(defaultValue);
