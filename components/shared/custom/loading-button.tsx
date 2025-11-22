"use client";

import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Icons } from "@/components/icons/registry";
import { Button, type buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface LoadingButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loadingText?: string;
  asChild?: boolean;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    {
      children,
      loading = false,
      icon,
      iconPosition = "left",
      loadingText,
      disabled,
      className,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <Button
        ref={ref}
        disabled={isDisabled}
        className={cn(className)}
        {...props}
      >
        {loading ? (
          <>
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            {loadingText || children}
          </>
        ) : (
          <>
            {icon && iconPosition === "left" && (
              <span className="mr-2">{icon}</span>
            )}
            {children}
            {icon && iconPosition === "right" && (
              <span className="ml-2">{icon}</span>
            )}
          </>
        )}
      </Button>
    );
  },
);

LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
