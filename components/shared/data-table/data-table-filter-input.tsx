"use client";

import type { Column } from "@tanstack/react-table";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DataTableFilterInputProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title: string;
  placeholder?: string;
  className?: string;
}

export function DataTableFilterInput<TData, TValue>({
  column,
  title,
  placeholder,
  className,
}: DataTableFilterInputProps<TData, TValue>) {
  return (
    <div className={className}>
      <Label htmlFor={`filter-${column?.id}`} className="text-xs font-medium">
        {title}
      </Label>
      <Input
        id={`filter-${column?.id}`}
        placeholder={placeholder || `Filter ${title.toLowerCase()}...`}
        value={(column?.getFilterValue() as string) ?? ""}
        onChange={(event) => column?.setFilterValue(event.target.value)}
        className="h-8 w-[150px] lg:w-[250px]"
      />
    </div>
  );
}
