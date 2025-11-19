import { cn } from "@/lib/utils";

export const DashboardShell = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("flex min-h-screen flex-col space-y-6", className)}
      {...props}
    />
  );
};
