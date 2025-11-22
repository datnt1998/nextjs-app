import type { ColumnFiltersState } from "@tanstack/react-table";
import { createParser } from "nuqs";
import { serializeColumnFilters } from "@/lib/data-table/utils";
import type { DataTableFilterField, ExtendedSortingState } from "@/types/table";

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

/**
 * Custom parser for sort order values in URL search params
 * Ensures value is either "asc" or "desc"
 */
export const sortOrderParser = createParser<"asc" | "desc">({
  parse: (v) => (v === "asc" || v === "desc" ? v : null),
  serialize: (v) => v || "",
});

/**
 * Parser for TanStack Table sorting state
 * Serializes sorting state to URL format: "column.desc" or "column.asc"
 */
export function getSortingStateParser<TData>() {
  return createParser<ExtendedSortingState<TData>>({
    parse: (value) => {
      if (!value) return [];

      const parts = value.split(".");
      if (parts.length !== 2) return [];

      const [id, order] = parts;
      if (order !== "asc" && order !== "desc") return [];

      return [{ id: id as keyof TData & string, desc: order === "desc" }];
    },
    serialize: (value) => {
      if (!value || value.length === 0) return "";
      const sort = value[0];
      return `${String(sort.id)}.${sort.desc ? "desc" : "asc"}`;
    },
  });
}

/**
 * Parser for column filters state
 * Uses compact serialization: "status:active,pending price:10-100"
 */
export function getColumnFiltersParser<TData>(
  filterFields?: DataTableFilterField<TData>[],
) {
  return createParser<Record<string, string | string[] | null>>({
    parse: (value) => {
      if (!value) return {};

      const filters: Record<string, string | string[] | null> = {};
      const pairs = value.split(" ");

      for (const pair of pairs) {
        const [key, val] = pair.split(":");
        if (!key || !val) continue;

        // Check if it's an array value (comma-separated)
        if (val.includes(",")) {
          filters[key] = val.split(",");
        } else {
          filters[key] = val;
        }
      }

      return filters;
    },
    serialize: (value) => {
      if (!value || Object.keys(value).length === 0) return "";

      // Convert to ColumnFiltersState for serialization
      const columnFilters: ColumnFiltersState = Object.entries(value)
        .filter(([_, v]) => v != null)
        .map(([id, v]) => ({ id, value: v }));

      return serializeColumnFilters(columnFilters, filterFields);
    },
  });
}
