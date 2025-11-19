"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTableStore } from "@/stores/table.store";

export function DensityToggle() {
  const { density, setDensity } = useTableStore();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">
        Density:
      </span>
      <div className="flex gap-1 rounded-md border border-border p-1">
        <Button
          variant={density === "compact" ? "primary" : "subtle"}
          size="sm"
          onClick={() => setDensity("compact")}
          className={cn("h-7 px-2 text-xs")}
        >
          Compact
        </Button>
        <Button
          variant={density === "comfortable" ? "primary" : "subtle"}
          size="sm"
          onClick={() => setDensity("comfortable")}
          className={cn("h-7 px-2 text-xs")}
        >
          Comfortable
        </Button>
        <Button
          variant={density === "spacious" ? "primary" : "subtle"}
          size="sm"
          onClick={() => setDensity("spacious")}
          className={cn("h-7 px-2 text-xs")}
        >
          Spacious
        </Button>
      </div>
    </div>
  );
}
