"use client";

import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Icons } from "@/components/icons/registry";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { NavItem } from "@/config/site";
import { Link } from "@/i18n/routing";
import { removeLocaleFromPathname } from "@/lib/navigation/utils";
import type { Permission } from "@/lib/rbac/permissions";
import { hasPermission } from "@/lib/rbac/permissions";
import { useUserStore } from "@/stores/user.store";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export interface NavGroupProps {
  title: string;
  items: NavItem[];
}

export function NavGroup({ title, items }: NavGroupProps) {
  const { state, isMobile } = useSidebar();
  const pathname = usePathname();
  const user = useUserStore((s) => s.user);
  const t = useTranslations("navigation");

  // Helper to get translated title from item
  const getItemTitle = (item: NavItem): string => {
    return item.translationKey ? t(item.translationKey) : item.title;
  };

  // Helper to check if user has permission to view item
  const canViewItem = (item: NavItem): boolean => {
    // If no permissions required, item is visible to all
    if (!item.permissions || item.permissions.length === 0) {
      return true;
    }

    // Check if user has at least one of the required permissions
    if (!user) return false;

    const userProfile = {
      id: user.id,
      role: user.role,
      permissions: user.permissions || [],
      tenant_id: user.tenant_id || "",
    };

    return item.permissions.some((permission) =>
      hasPermission(userProfile, permission as Permission)
    );
  };

  // Filter items based on permissions
  const visibleItems = items.filter(canViewItem);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {visibleItems.map((item) => {
          const key = `${item.title}-${item.href || "collapsible"}`;

          // For collapsible items, filter sub-items based on permissions
          if (item.items) {
            const visibleSubItems = item.items.filter(canViewItem);

            // Skip if no visible sub-items
            if (visibleSubItems.length === 0) {
              return null;
            }

            const itemWithVisibleSubItems = {
              ...item,
              items: visibleSubItems,
            };

            if (state === "collapsed" && !isMobile) {
              return (
                <SidebarMenuCollapsedDropdown
                  key={key}
                  item={itemWithVisibleSubItems}
                  pathname={pathname}
                  getTitle={getItemTitle}
                />
              );
            }

            return (
              <SidebarMenuCollapsible
                key={key}
                item={itemWithVisibleSubItems}
                pathname={pathname}
                getTitle={getItemTitle}
              />
            );
          }

          return (
            <SidebarMenuLink
              key={key}
              item={item}
              pathname={pathname}
              getTitle={getItemTitle}
            />
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavBadge({ children }: { children: ReactNode }) {
  return <Badge className="rounded-full px-1 py-0 text-xs">{children}</Badge>;
}

function SidebarMenuLink({
  item,
  pathname,
  getTitle,
}: {
  item: NavItem;
  pathname: string;
  getTitle: (item: NavItem) => string;
}) {
  const { setOpenMobile } = useSidebar();
  const Icon = item.icon ? Icons[item.icon] : undefined;
  const title = getTitle(item);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={checkIsActive(pathname, item)}
        tooltip={title}
      >
        <Link href={item.href} onClick={() => setOpenMobile(false)}>
          {Icon && <Icon className="size-4" />}
          <span className="font-medium">{title}</span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function SidebarMenuCollapsible({
  item,
  pathname,
  getTitle,
}: {
  item: NavItem;
  pathname: string;
  getTitle: (item: NavItem) => string;
}) {
  const { setOpenMobile } = useSidebar();
  const Icon = item.icon ? Icons[item.icon] : undefined;
  const title = getTitle(item);

  return (
    <Collapsible
      asChild
      defaultOpen={checkIsActive(pathname, item, true)}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={title}>
            {Icon && <Icon className="size-4" />}
            <span className="font-medium">{title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 rtl:rotate-180" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="CollapsibleContent">
          <SidebarMenuSub>
            {item.items?.map((subItem) => {
              const SubIcon = subItem.icon ? Icons[subItem.icon] : undefined;
              const subTitle = getTitle(subItem);
              return (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={checkIsActive(pathname, subItem)}
                  >
                    <Link
                      href={subItem.href}
                      onClick={() => setOpenMobile(false)}
                    >
                      {SubIcon && <SubIcon className="size-4" />}
                      <span className="font-medium">{subTitle}</span>
                      {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

function SidebarMenuCollapsedDropdown({
  item,
  pathname,
  getTitle,
}: {
  item: NavItem;
  pathname: string;
  getTitle: (item: NavItem) => string;
}) {
  const Icon = item.icon ? Icons[item.icon] : undefined;
  const title = getTitle(item);

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={title}
            isActive={checkIsActive(pathname, item)}
          >
            {Icon && <Icon className="size-4" />}
            <span>{title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" sideOffset={4}>
          <DropdownMenuLabel>
            {title} {item.badge ? `(${item.badge})` : ""}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items?.map((sub) => {
            const SubIcon = sub.icon ? Icons[sub.icon] : undefined;
            const subTitle = getTitle(sub);
            return (
              <DropdownMenuItem key={`${sub.title}-${sub.href}`} asChild>
                <Link
                  href={sub.href}
                  className={`${checkIsActive(pathname, sub) ? "bg-secondary" : ""}`}
                >
                  {SubIcon && <SubIcon className="size-4" />}
                  <span className="max-w-52 text-wrap">{subTitle}</span>
                  {sub.badge && (
                    <span className="ms-auto text-xs">{sub.badge}</span>
                  )}
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}

function checkIsActive(
  pathname: string,
  item: NavItem,
  mainNav = false
): boolean {
  const itemUrl = item.href;

  // Remove locale from pathname for comparison
  const pathnameWithoutLocale = removeLocaleFromPathname(pathname);

  // Remove query params from both
  const cleanPathname = pathnameWithoutLocale.split("?")[0];
  const cleanItemUrl = itemUrl.split("?")[0];

  // Exact match
  if (cleanPathname === cleanItemUrl) {
    return true;
  }

  // Check if any child nav is active
  if (item?.items?.some((i) => checkIsActive(pathname, i))) {
    return true;
  }

  // For main nav, use prefix matching
  if (mainNav) {
    // Check if pathname starts with itemUrl
    return cleanPathname.startsWith(`${cleanItemUrl}/`);
  }

  return false;
}
