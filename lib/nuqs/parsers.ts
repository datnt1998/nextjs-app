import { createParser } from "nuqs";

/**
 * Custom parser for number values in URL search params
 * Converts string to number, returns null if invalid
 */
export const numberParser = createParser<number>({
  parse: (v) => (v ? Number(v) : null),
  serialize: (v) => (v != null ? String(v) : ""),
});

/**
 * Custom parser for string array values in URL search params
 * Splits comma-separated values into array
 */
export const stringArrayParser = createParser<string[]>({
  parse: (v) => (v ? v.split(",") : null),
  serialize: (v) => (v && v.length > 0 ? v.join(",") : ""),
});
