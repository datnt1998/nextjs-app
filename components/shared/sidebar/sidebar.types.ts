export interface SidebarItem {
  label: string;
  icon: React.ElementType;
  href: string;
  roles?: string[]; // filtering handled outside
}

export type SidebarVariant = "flat" | "floating";

export interface SidebarProps {
  items: SidebarItem[];
  bottomItems?: SidebarItem[];
  collapsed: boolean;
  onToggle: () => void;
  variant?: SidebarVariant;
  className?: string;
}

export interface SidebarItemProps {
  item: SidebarItem;
  collapsed: boolean;
  isActive: boolean;
}
