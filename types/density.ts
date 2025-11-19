/**
 * Table density types
 */
export type TableDensity = "compact" | "comfortable" | "spacious";

/**
 * Density configuration with labels and descriptions
 */
export interface DensityOption {
  value: TableDensity;
  label: string;
  description: string;
}

/**
 * Available density options
 */
export const DENSITY_OPTIONS: DensityOption[] = [
  {
    value: "compact",
    label: "Compact",
    description: "Minimal padding for more rows",
  },
  {
    value: "comfortable",
    label: "Comfortable",
    description: "Balanced spacing (default)",
  },
  {
    value: "spacious",
    label: "Spacious",
    description: "Maximum padding for readability",
  },
] as const;

/**
 * Density-specific CSS classes for table cells
 */
export const DENSITY_CLASSES: Record<TableDensity, string> = {
  compact: "h-8 py-1",
  comfortable: "h-12 py-2",
  spacious: "h-16 py-4",
};
