import {
  IconChevronDown,
  IconHome,
  IconLoader2,
  IconMenu2,
  IconPlus,
  IconSearch,
  IconSettings,
  IconTrash,
  IconUsers,
  IconX,
} from "@tabler/icons-react";

export const Icons = {
  home: IconHome,
  users: IconUsers,
  plus: IconPlus,
  settings: IconSettings,
  search: IconSearch,
  trash: IconTrash,
  chevronDown: IconChevronDown,
  menu: IconMenu2,
  close: IconX,
  spinner: IconLoader2,
} as const;

export type IconName = keyof typeof Icons;
