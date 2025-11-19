# Sidebar Component

A professional, reusable sidebar component with smooth animations, mobile responsiveness, and full dark/light mode support.

## Features

- ✅ **Expandable/Collapsible** - Smooth width transitions using Framer Motion
- ✅ **Tooltips** - Show labels on hover when collapsed
- ✅ **Mobile Responsive** - Uses ShadCN Sheet for mobile slide-in menu
- ✅ **Active Route Highlighting** - Automatic detection using `usePathname`
- ✅ **Dark/Light Mode** - Full theme support
- ✅ **Accessible** - Built on Radix UI primitives
- ✅ **Configurable** - Fully controlled through props

## Installation

This component requires the following dependencies:

```bash
npm install framer-motion @radix-ui/react-dialog @radix-ui/react-scroll-area @radix-ui/react-separator lucide-react
```

## Usage

### Basic Example

```tsx
"use client";

import { useState } from "react";
import { Sidebar } from "@/components/shared/sidebar";
import { Home, Users, Settings, LogOut } from "lucide-react";

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  const items = [
    { label: "Dashboard", icon: Home, href: "/dashboard" },
    { label: "Users", icon: Users, href: "/dashboard/users" },
    { label: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  const bottomItems = [{ label: "Logout", icon: LogOut, href: "/logout" }];

  return (
    <div className="flex h-screen">
      <Sidebar
        items={items}
        bottomItems={bottomItems}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
```

### With State Management (Zustand)

```tsx
"use client";

import { Sidebar } from "@/components/shared/sidebar";
import { useSidebarStore } from "@/stores/sidebar.store";
import { Home, Users, Settings } from "lucide-react";

export default function DashboardLayout({ children }) {
  const { isCollapsed, toggle } = useSidebarStore();

  const items = [
    { label: "Dashboard", icon: Home, href: "/dashboard" },
    { label: "Users", icon: Users, href: "/dashboard/users" },
    { label: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar items={items} collapsed={isCollapsed} onToggle={toggle} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
```

### With RBAC Filtering

```tsx
"use client";

import { useMemo } from "react";
import { Sidebar } from "@/components/shared/sidebar";
import { useUserStore } from "@/stores/user.store";
import { Home, Users, Settings, FileText } from "lucide-react";

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const userRole = useUserStore((s) => s.role);

  const allItems = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
      roles: ["owner", "admin", "manager", "editor", "viewer"],
    },
    {
      label: "Users",
      icon: Users,
      href: "/dashboard/users",
      roles: ["owner", "admin"],
    },
    {
      label: "Items",
      icon: FileText,
      href: "/dashboard/items",
      roles: ["owner", "admin", "manager", "editor"],
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      roles: ["owner", "admin"],
    },
  ];

  // Filter items based on user role
  const items = useMemo(
    () =>
      allItems.filter((item) => !item.roles || item.roles.includes(userRole)),
    [userRole]
  );

  return (
    <div className="flex h-screen">
      <Sidebar
        items={items}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
```

## Props

### Sidebar

| Prop          | Type                   | Required | Default  | Description                                       |
| ------------- | ---------------------- | -------- | -------- | ------------------------------------------------- |
| `items`       | `SidebarItem[]`        | ✅ Yes   | -        | Main navigation items                             |
| `bottomItems` | `SidebarItem[]`        | ⚪ No    | `[]`     | Items shown at the bottom (e.g., logout, profile) |
| `collapsed`   | `boolean`              | ✅ Yes   | -        | Whether the sidebar is collapsed                  |
| `onToggle`    | `() => void`           | ✅ Yes   | -        | Callback when toggle button is clicked            |
| `variant`     | `"flat" \| "floating"` | ⚪ No    | `"flat"` | Visual style variant                              |
| `className`   | `string`               | ⚪ No    | -        | Additional CSS classes                            |

### SidebarItem

| Property | Type                | Required | Description                                              |
| -------- | ------------------- | -------- | -------------------------------------------------------- |
| `label`  | `string`            | ✅ Yes   | Display text for the item                                |
| `icon`   | `React.ElementType` | ✅ Yes   | Icon component (from lucide-react or custom)             |
| `href`   | `string`            | ✅ Yes   | Navigation path                                          |
| `roles`  | `string[]`          | ⚪ No    | Optional roles for filtering (handled outside component) |

## Behavior

### Desktop

- **Expanded (240px)**: Shows icon + label
- **Collapsed (72px)**: Shows only icon with tooltip on hover
- **Smooth Animation**: Framer Motion handles width, opacity, and layout transitions
- **Active State**: Automatically highlights based on current pathname

### Mobile

- **Hidden by default**: Sidebar is hidden on screens < 1024px
- **Hamburger button**: Fixed button in top-left corner
- **Sheet overlay**: Slides in from left with backdrop
- **Full width**: 256px (sm:max-w-sm) on mobile

### Active Route Detection

The sidebar automatically detects the active route using Next.js `usePathname()`:

- Exact match for `/dashboard`
- Prefix match for all other routes (e.g., `/dashboard/users` matches `/dashboard/users/123`)

## Styling

### Dimensions

- **Expanded**: 240px width
- **Collapsed**: 72px width
- **Mobile**: 256px width (sm:max-w-sm)

### Colors

Uses semantic tokens for full theme support:

- Background: `bg-card`
- Border: `border-border`
- Active: `bg-accent text-accent-foreground`
- Hover: `hover:bg-accent hover:text-accent-foreground`

### Spacing

- Padding: `px-3 py-2` for items
- Gap: `gap-3` between icon and label
- Item spacing: `space-y-2`

## Variants

The sidebar supports two visual variants:

### Flat (Default)

Full-height sidebar with no shadow or rounded corners. Best for traditional dashboard layouts.

```tsx
<Sidebar items={items} collapsed={collapsed} onToggle={toggle} variant="flat" />
```

**Characteristics:**

- Full height from top to bottom
- No shadow or elevation
- Sharp corners
- Flush with page edges

### Floating

Elevated sidebar with rounded corners and subtle shadow. Best for modern, card-based layouts.

```tsx
<Sidebar
  items={items}
  collapsed={collapsed}
  onToggle={toggle}
  variant="floating"
/>
```

**Characteristics:**

- Margin on all sides (16px)
- Rounded corners (8px)
- Subtle shadow for elevation
- Appears to "float" above the background

**Tip:** Use `variant="floating"` with a light background color (e.g., `bg-muted/30`) for best visual effect.

## Customization

### Custom Icons

You can use any icon library that exports React components:

```tsx
import { Home } from "lucide-react";
import { FaUser } from "react-icons/fa";
import CustomIcon from "./custom-icon";

const items = [
  { label: "Home", icon: Home, href: "/dashboard" },
  { label: "Profile", icon: FaUser, href: "/profile" },
  { label: "Custom", icon: CustomIcon, href: "/custom" },
];
```

### Custom Styling

```tsx
<Sidebar
  items={items}
  collapsed={collapsed}
  onToggle={toggle}
  className="bg-slate-900 border-slate-800"
/>
```

### Custom Toggle Button

The toggle button is built-in, but you can control it externally:

```tsx
<Button onClick={() => setCollapsed(!collapsed)}>
  Toggle Sidebar
</Button>

<Sidebar
  items={items}
  collapsed={collapsed}
  onToggle={() => {}} // No-op since we control it externally
/>
```

## Accessibility

- ✅ **Keyboard Navigation**: Full keyboard support via Radix UI
- ✅ **Screen Readers**: Proper ARIA labels and semantic HTML
- ✅ **Focus Management**: Focus trap in mobile sheet
- ✅ **Color Contrast**: Meets WCAG AA standards

## Performance

- ✅ **Optimized Animations**: Uses Framer Motion's layout animations
- ✅ **Lazy Rendering**: Mobile sheet only renders when open
- ✅ **Memoization**: Use `useMemo` for filtered items
- ✅ **No Layout Shift**: Fixed widths prevent content jumping

## Examples

### With Logo

```tsx
<div className="flex items-center justify-between p-4">
  <motion.div
    animate={{ opacity: collapsed ? 0 : 1 }}
    className="flex items-center gap-2"
  >
    <Logo className="h-8 w-8" />
    <span className="font-semibold text-lg">MyApp</span>
  </motion.div>
  <Button variant="ghost" size="icon" onClick={onToggle}>
    {collapsed ? <ChevronRight /> : <ChevronLeft />}
  </Button>
</div>
```

### With Badges

```tsx
const items = [
  {
    label: "Messages",
    icon: Mail,
    href: "/messages",
    badge: 5, // Add custom property
  },
];

// Extend SidebarItem component to show badge
```

### With Nested Items

For nested navigation, consider using a separate component or accordion pattern.

## Related Components

- `Button` - Used for navigation items
- `Tooltip` - Shows labels when collapsed
- `Sheet` - Mobile slide-in menu
- `ScrollArea` - Scrollable navigation
- `Separator` - Visual dividers

## Architecture

This is a **Layer 2: Shared Composite Component**

- ✅ Built from atomic UI primitives
- ✅ No business logic or domain code
- ✅ Fully reusable across features
- ✅ Controlled through props

See [COMPONENT_ARCHITECTURE.md](../../../COMPONENT_ARCHITECTURE.md) for more details.
