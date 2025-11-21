"use client";

import type { Column } from "@tanstack/react-table";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface DataTableFilterSliderProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title: string;
  min: number;
  max: number;
  step?: number;
  className?: string;
}

export function DataTableFilterSlider<TData, TValue>({
  column,
  title,
  min,
  max,
  step = 1,
  className,
}: DataTableFilterSliderProps<TData, TValue>) {
  const value = (column?.getFilterValue() as [number, number]) || [min, max];

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium">{title}</Label>
        <span className="text-xs text-muted-foreground">
          {value[0]} - {value[1]}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={(newValue) => {
          column?.setFilterValue(newValue);
        }}
        className="mt-2"
      />
    </div>
  );
}
