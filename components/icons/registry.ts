import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconFolder,
  IconHome,
  IconLoader2,
  IconLogout,
  IconMenu2,
  IconPlus,
  IconSearch,
  IconSettings,
  IconTrash,
  IconUser,
  IconUsers,
  IconX,
} from "@tabler/icons-react";

export const Icons = {
  home: IconHome,
  users: IconUsers,
  user: IconUser,
  plus: IconPlus,
  settings: IconSettings,
  search: IconSearch,
  trash: IconTrash,
  folder: IconFolder,
  chevronDown: IconChevronDown,
  chevronLeft: IconChevronLeft,
  chevronRight: IconChevronRight,
  menu: IconMenu2,
  close: IconX,
  spinner: IconLoader2,
  logout: IconLogout,
} as const;

export type IconName = keyof typeof Icons;
