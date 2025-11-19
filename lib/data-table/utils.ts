import type { ColumnFiltersState } from "@tanstack/react-table";
import type { z } from "zod";
import type { DataTableFilterField, SearchParams } from "@/types/table";
import { DELIMITERS } from "./delimiters";

/**
 * Serializes column filters into a compact URL-friendly string
 * Format: "key1:value1 key2:value2,value3 key3:min-max"
 *
 * @example
 * serializeColumnFilters(
 *   [{ id: "status", value: ["active", "pending"] }],
 *   filterFields
 * )
 * // Returns: "status:active,pending"
 */
export function serializeColumnFilters<TData>(
  filters: ColumnFiltersState,
  filterFields?: DataTableFilterField<TData>[]
): string {
  if (!filters.length || !filterFields) return "";

  const serialized: string[] = [];

  for (const filter of filters) {
    const field = filterFields.find((f) => f.id === filter.id);

    // Skip if field not found or command is disabled
    if (!field || field.commandDisabled) continue;

    const value = filter.value;

    // Handle different filter types
    if (field.type === "checkbox" && Array.isArray(value)) {
      // Checkbox: array of values
      if (value.length > 0) {
        serialized.push(
          `${filter.id}${DELIMITERS.KEY_VALUE}${value.join(DELIMITERS.ARRAY)}`
        );
      }
    } else if (
      field.type === "slider" &&
      Array.isArray(value) &&
      value.length === 2
    ) {
      // Slider: range with min-max
      serialized.push(
        `${filter.id}${DELIMITERS.KEY_VALUE}${value[0]}${DELIMITERS.RANGE}${value[1]}`
      );
    } else if (
      field.type === "timerange" &&
      Array.isArray(value) &&
      value.length === 2
    ) {
      // Timerange: date range
      const [start, end] = value;
      if (start && end) {
        serialized.push(
          `${filter.id}${DELIMITERS.KEY_VALUE}${start}${DELIMITERS.DATE_RANGE}${end}`
        );
      }
    } else if (field.type === "input" && typeof value === "string" && value) {
      // Input: simple string
      serialized.push(`${filter.id}${DELIMITERS.KEY_VALUE}${value}`);
    }
  }

  return serialized.join(DELIMITERS.FILTER);
}

/**
 * Deserializes URL search params into structured filter objects
 * Validates against provided Zod schema
 *
 * @example
 * deserializeFilters(
 *   { filters: "status:active,pending" },
 *   z.object({ status: z.array(z.string()) })
 * )
 * // Returns: { status: ["active", "pending"] }
 */
export function deserializeFilters<T extends z.ZodType>(
  searchParams: SearchParams,
  schema: T
): z.infer<T> {
  const filtersParam = searchParams.filters;

  if (!filtersParam || typeof filtersParam !== "string") {
    return {} as z.infer<T>;
  }

  try {
    const parsed: Record<string, string | string[] | number[]> = {};

    // Split by filter delimiter
    const filters = filtersParam.split(DELIMITERS.FILTER);

    for (const filter of filters) {
      if (!filter.includes(DELIMITERS.KEY_VALUE)) continue;

      const [key, value] = filter.split(DELIMITERS.KEY_VALUE);

      if (!key || !value) continue;

      // Check if it's an array (contains comma)
      if (value.includes(DELIMITERS.ARRAY)) {
        parsed[key] = value.split(DELIMITERS.ARRAY);
      }
      // Check if it's a range (contains dash)
      else if (value.includes(DELIMITERS.RANGE)) {
        const [min, max] = value.split(DELIMITERS.RANGE).map(Number);
        if (!Number.isNaN(min) && !Number.isNaN(max)) {
          parsed[key] = [min, max];
        }
      }
      // Check if it's a date range (contains underscore)
      else if (value.includes(DELIMITERS.DATE_RANGE)) {
        parsed[key] = value.split(DELIMITERS.DATE_RANGE);
      }
      // Simple string value
      else {
        parsed[key] = value;
      }
    }

    // Validate against schema
    return schema.parse(parsed);
  } catch (error) {
    console.error("Failed to deserialize filters:", error);
    return {} as z.infer<T>;
  }
}

/**
 * Converts column filters to a Record format for easier manipulation
 */
export function columnFiltersToRecord(
  filters: ColumnFiltersState
): Record<string, string | string[] | number[] | null> {
  const record: Record<string, string | string[] | number[] | null> = {};

  for (const filter of filters) {
    record[filter.id] = filter.value as string | string[] | number[];
  }

  return record;
}

/**
 * Converts a Record to column filters format
 */
export function recordToColumnFilters(
  record: Record<string, string | string[] | number[] | null>
): ColumnFiltersState {
  return Object.entries(record)
    .filter(([_, value]) => value != null)
    .map(([id, value]) => ({ id, value }));
}

/**
 * Merges URL params with filter state
 */
export function mergeFilters(
  existing: ColumnFiltersState,
  newFilters: Record<string, string | string[] | number[] | null>
): ColumnFiltersState {
  const existingRecord = columnFiltersToRecord(existing);
  const merged = { ...existingRecord, ...newFilters };
  return recordToColumnFilters(merged);
}
