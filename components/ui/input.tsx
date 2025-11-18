import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-input bg-background px-3 py-2 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        underline:
          "border-b border-input bg-transparent px-0 py-2 rounded-none focus-visible:border-primary",
        filled:
          "bg-muted border-0 px-3 py-2 rounded-md focus-visible:bg-muted/80",
        ghost:
          "bg-transparent border-0 px-3 py-2 rounded-md focus-visible:bg-accent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
