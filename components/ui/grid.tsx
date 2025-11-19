import * as React from "react";
import { cn } from "@/lib/utils";

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: "sm" | "md" | "lg";
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ cols = 3, gap = "md", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid",
          {
            "grid-cols-1": cols === 1,
            "grid-cols-1 md:grid-cols-2": cols === 2,
            "grid-cols-1 md:grid-cols-2 lg:grid-cols-3": cols === 3,
            "grid-cols-1 md:grid-cols-2 lg:grid-cols-4": cols === 4,
            "grid-cols-2 md:grid-cols-3 lg:grid-cols-6": cols === 6,
            "grid-cols-12": cols === 12,
          },
          {
            "gap-4": gap === "sm",
            "gap-6": gap === "md",
            "gap-8": gap === "lg",
          },
          className,
        )}
        {...props}
      />
    );
  },
);
Grid.displayName = "Grid";
