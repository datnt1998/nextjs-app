import { cn } from "@/lib/utils";

interface PageHeaderProps {
  /**
   * Page title
   */
  title: string;
  /**
   * Page description/subtitle
   */
  description?: string;
  /**
   * Action buttons or elements to display on the right
   */
  actions?: React.ReactNode;
  /**
   * Additional content below the header
   */
  children?: React.ReactNode;
  /**
   * Custom className for the container
   */
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
