import { cn } from "@/lib/utils";

export const Section = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  return (
    <section className={cn("py-12 md:py-16 lg:py-20", className)} {...props} />
  );
};
