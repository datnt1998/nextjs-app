import type { Row } from "@tanstack/react-table";
import z from "zod";

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type StringKeyOf<TData> = Extract<keyof TData, string>;

export const filterSchema = z.object({
  id: z.string(),
  value: z.union([z.string(), z.array(z.string())]),
  rowId: z.string(),
});

/**
 * Extended sorting state with type-safe column IDs
 */
export type ExtendedSortingState<TData> = {
  id: keyof TData extends string ? keyof TData : string;
  desc: boolean;
}[];

export interface DataTableActions<TData> {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (row: Row<TData>) => void;
  isPrimary?: boolean;
  display?: boolean;
}

export type Filter<TData> = Prettify<
  Omit<z.infer<typeof filterSchema>, "id"> & {
    id: StringKeyOf<TData>;
  }
>;

/**
 * Search params type for URL query parameters
 */
export type SearchParams = Record<string, string | string[] | undefined>;

/**
 * Date preset for time range filters
 */
export interface DatePreset {
  label: string;
  startDate: Date;
  endDate: Date;
  shortcut?: string;
}

/**
 * Option type for filter selections
 */
export interface Option {
  label: string;
  value: string | boolean | number | undefined;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
}

/**
 * Base filter field configuration
 */
interface BaseFilterField<TData> {
  /** Column ID to filter */
  id: keyof TData & string;
  /** Display label */
  label: string;
  /** Whether filter is open by default */
  defaultOpen?: boolean;
  /** Whether to disable command palette for this filter */
  commandDisabled?: boolean;
}

/**
 * Input filter (text search)
 */
export interface InputFilterField<TData> extends BaseFilterField<TData> {
  type: "input";
  placeholder?: string;
  /** Predefined options for autocomplete */
  options?: Option[];
}

/**
 * Checkbox filter (multi-select)
 */
export interface CheckboxFilterField<TData> extends BaseFilterField<TData> {
  type: "checkbox";
  options: Option[];
  /** Custom component to render */
  component?: (props: { options: Option[] }) => React.ReactNode;
}

/**
 * Slider filter (numeric range)
 */
export interface SliderFilterField<TData> extends BaseFilterField<TData> {
  type: "slider";
  min: number;
  max: number;
  step?: number;
  /** Auto-generates options if not provided */
  options?: Option[];
}

/**
 * Time range filter (date selection)
 */
export interface TimerangeFilterField<TData> extends BaseFilterField<TData> {
  type: "timerange";
  /** Predefined date range presets */
  presets?: DatePreset[];
}

/**
 * Discriminated union of all filter field types
 */
export type DataTableFilterField<TData> =
  | InputFilterField<TData & { search: string }>
  | CheckboxFilterField<TData>
  | SliderFilterField<TData>
  | TimerangeFilterField<TData>;

/**
 * Sheet field configuration for detail views
 */
export interface SheetField<TData, TMeta = unknown> {
  /** Column ID */
  id: keyof TData;
  /** Field type/render mode */
  type: "readonly" | "input" | "checkbox" | "slider" | "timerange";
  /** Custom component renderer */
  component?: (data: TData, meta?: TMeta) => React.ReactElement;
  /** Conditional visibility */
  condition?: (data: TData) => boolean;
  /** Custom className */
  className?: string;
  /** Skeleton loading className */
  skeletonClassName?: string;
}

/**
 * Data table configuration options
 */
export interface DataTableConfig {
  /** Enable URL state synchronization */
  enableUrlState?: boolean;
  /** Default page size */
  defaultPageSize?: number;
  /** Enable row selection */
  enableRowSelection?: boolean;
  /** Enable column filters */
  enableColumnFilters?: boolean;
  /** Debounce delay for search inputs (ms) */
  debounceMs?: number;
  /** History mode for URL updates */
  historyMode?: "push" | "replace";
}

/**
 * Serialized filter state for URL
 */
export type SerializedFilters = Record<string, string | null>;
