"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface InputWithAddonsProps extends React.ComponentProps<"input"> {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  containerClassName?: string;
}

const InputWithAddons = React.forwardRef<
  HTMLInputElement,
  InputWithAddonsProps
>(({ leading, trailing, containerClassName, className, ...props }, ref) => {
  return (
    <div
      className={cn(
        "border-input ring-offset-background focus-within:ring-ring group flex h-9 w-full items-center rounded-md border bg-transparent text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 overflow-hidden",
        containerClassName
      )}
    >
      {leading ? (
        <div className="bg-muted/50 flex h-full items-center border-r border-input px-3 text-muted-foreground">
          {leading}
        </div>
      ) : null}
      <Input
        className={cn(
          "h-full border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0",
          className
        )}
        ref={ref}
        {...props}
      />
      {trailing ? (
        <div className="bg-muted/50 flex h-full items-center border-l border-input px-3 text-muted-foreground">
          {trailing}
        </div>
      ) : null}
    </div>
  );
});
InputWithAddons.displayName = "InputWithAddons";

export { InputWithAddons };
