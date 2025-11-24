import * as React from "react";
import { cn } from "@/lib/utils";

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "vertical" | "horizontal";
  gap?: "sm" | "md" | "lg";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between";
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    { direction = "vertical", gap = "md", align, justify, className, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          {
            "flex-col": direction === "vertical",
            "flex-row": direction === "horizontal",
          },
          {
            "gap-2": gap === "sm",
            "gap-4": gap === "md",
            "gap-6": gap === "lg",
          },
          {
            "items-start": align === "start",
            "items-center": align === "center",
            "items-end": align === "end",
            "items-stretch": align === "stretch",
          },
          {
            "justify-start": justify === "start",
            "justify-center": justify === "center",
            "justify-end": justify === "end",
            "justify-between": justify === "between",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Stack.displayName = "Stack";
