"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Fragment } from "react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function TopNav() {
  const pathname = usePathname();
  const t = useTranslations("navigation");

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    // Remove locale segment (first segment)
    const pathSegments = segments.slice(1);

    if (pathSegments.length === 0) {
      return [];
    }

    return pathSegments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 2).join("/")}`;
      const isLast = index === pathSegments.length - 1;

      // Try to translate common segments
      const translationMap: Record<string, string> = {
        dashboard: t("main.dashboard"),
        users: t("main.users"),
        items: t("main.items"),
        settings: t("main.settings"),
        components: t("main.components"),
        upload: t("main.upload"),
        table: t("main.dataTable"),
      };

      const label =
        translationMap[segment] ||
        segment.charAt(0).toUpperCase() + segment.slice(1);

      return {
        label,
        href,
        isLast,
      };
    });
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        {breadcrumbs.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb) => (
                <Fragment key={crumb.href}>
                  <BreadcrumbItem>
                    {crumb.isLast ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={crumb.href}>
                        {crumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!crumb.isLast && <BreadcrumbSeparator />}
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>
      <div className="ml-auto flex items-center gap-2">
        <ThemeSwitcher />
      </div>
    </header>
  );
}
