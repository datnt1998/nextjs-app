import type { Row } from "@tanstack/react-table";
import { createParser } from "nuqs/server";
import z from "zod";
import {
  type ExtendedSortingState,
  type Filter,
  filterSchema,
} from "@/types/table";

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
 * Create a parser for data table filters.
 * @param originalRow The original row data to create the parser for.
 * @returns A parser for data table filters state.
 */
export const getFiltersStateParser = <T>(originalRow?: Row<T>["original"]) => {
  const validKeys = originalRow ? new Set(Object.keys(originalRow)) : null;

  return createParser<Filter<T>[]>({
    parse: (value) => {
      try {
        const parsed = JSON.parse(value);
        const result = z.array(filterSchema).safeParse(parsed);

        if (!result.success) return null;

        if (validKeys && result.data.some((item) => !validKeys.has(item.id))) {
          return null;
        }

        return result.data as Filter<T>[];
      } catch {
        return null;
      }
    },
    serialize: (value) => JSON.stringify(value),
    eq: (a, b) =>
      a.length === b.length &&
      a.every(
        (filter, index) =>
          filter.id === b[index]?.id && filter.value === b[index]?.value
      ),
  });
};
