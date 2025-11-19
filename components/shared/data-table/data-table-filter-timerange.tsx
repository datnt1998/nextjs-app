"use client";

import type { Column } from "@tanstack/react-table";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { DatePreset } from "@/types/table";

interface DataTableFilterTimerangeProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title: string;
  presets?: DatePreset[];
  className?: string;
}

export function DataTableFilterTimerange<TData, TValue>({
  column,
  title,
  presets,
  className,
}: DataTableFilterTimerangeProps<TData, TValue>) {
  const value = column?.getFilterValue() as [string, string] | undefined;

  const [date, setDate] = React.useState<DateRange | undefined>(() => {
    if (value && value[0] && value[1]) {
      return {
        from: new Date(value[0]),
        to: new Date(value[1]),
      };
    }
    return undefined;
  });

  React.useEffect(() => {
    if (date?.from && date?.to) {
      column?.setFilterValue([
        format(date.from, "yyyy-MM-dd"),
        format(date.to, "yyyy-MM-dd"),
      ]);
    } else {
      column?.setFilterValue(undefined);
    }
  }, [date, column]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Label className="text-xs font-medium">{title}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 w-[250px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            {presets && presets.length > 0 && (
              <div className="flex flex-col gap-1 border-r p-2">
                <div className="px-2 pb-2 text-xs font-semibold">Presets</div>
                {presets.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="ghost"
                    size="sm"
                    className="justify-start text-xs"
                    onClick={() => {
                      setDate({
                        from: preset.startDate,
                        to: preset.endDate,
                      });
                    }}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            )}
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
