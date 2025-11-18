import { createParser } from "nuqs";
import { numberParser } from "./parsers";

/**
 * Factory pattern for pagination parameters
 * Provides page and limit with sensible defaults
 */
export const paginationParams = {
  page: numberParser.withDefault(1),
  limit: numberParser.withDefault(10),
};

/**
 * Factory pattern for sorting parameters
 * Provides sortBy and sortOrder with defaults
 */
export const sortParams = {
  sortBy: createParser<string>({
    parse: (v) => v || null,
    serialize: (v) => v || "",
  }).withDefault("createdAt"),
  sortOrder: createParser<"asc" | "desc">({
    parse: (v) => (v === "asc" || v === "desc" ? v : null),
    serialize: (v) => v || "",
  }).withDefault("desc"),
};

/**
 * Factory pattern for filter parameters
 * Provides search and status filters
 */
export const filterParams = {
  search: createParser<string>({
    parse: (v) => v || null,
    serialize: (v) => v || "",
  }),
  status: createParser<string[]>({
    parse: (v) => (v ? v.split(",") : null),
    serialize: (v) => (v && v.length > 0 ? v.join(",") : ""),
  }),
};
