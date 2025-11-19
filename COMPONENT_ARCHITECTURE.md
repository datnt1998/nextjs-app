# Component Architecture

This document defines the layered component architecture used in this NextJS Starter Kit. Following these rules ensures maintainability, scalability, and consistency across the codebase.

## Architecture Overview

The component architecture is organized into **four distinct layers**, each with specific responsibilities and constraints:

```
components/
├── ui/                    # Layer 1: Atomic UI primitives
├── shared/                # Layer 2: Composite reusable components
├── dashboard/             # Layer 3: Dashboard shell components
└── features/              # Layer 4: Feature-specific components
    ├── items/
    ├── upload/
    └── [feature-name]/
```

## Layer Definitions

### Layer 1: Atomic UI Components (`components/ui/`)

**Purpose**: Primitive UI elements that serve as the foundation for all other components.

**Rules**:

- ✅ MUST be built using MCP ShadCN UI primitives (Radix UI)
- ✅ MUST support `className` prop for style composition
- ✅ MUST use `forwardRef` for ref forwarding
- ✅ MUST support `asChild` pattern where appropriate (using Radix Slot)
- ✅ MUST use `cn()` utility for className merging
- ✅ MUST use theme tokens: `hsl(var(--token-name))` or Tailwind classes
- ❌ MUST NOT contain business logic
- ❌ MUST NOT contain domain-specific code
- ❌ MUST NOT use raw HTML elements for interactive components (use Radix primitives)

**Examples**:

- `button.tsx` - Button with variants (primary, secondary, outline, etc.)
- `input.tsx` - Input with variants (default, underline, filled, ghost)
- `card.tsx` - Card with variants (default, elevated, outline, glass)
- `dialog.tsx` - Modal dialog primitive
- `dropdown-menu.tsx` - Dropdown menu primitive
- `tooltip.tsx` - Tooltip primitive
- `container.tsx` - Layout container
- `grid.tsx` - Grid layout
- `stack.tsx` - Flex stack layout
- `section.tsx` - Section wrapper

**Code Example**:

```tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-10 px-4 py-2",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

### Layer 2: Shared Reusable Components (`components/shared/`)

**Purpose**: Composite components built from atomic primitives that can be reused across features.

**Rules**:

- ✅ MUST be built from Layer 1 (atomic UI) components
- ✅ MUST support `className` prop
- ✅ MUST use `forwardRef` where appropriate
- ✅ CAN use external libraries (TanStack Table, etc.)
- ✅ CAN use Zustand stores for UI state (density, preferences)
- ❌ MUST NOT contain business logic
- ❌ MUST NOT contain domain-specific code
- ❌ MUST NOT directly access APIs or databases

**Examples**:

- `data-table/data-table.tsx` - Advanced data table with TanStack Table
- `data-table/density-toggle.tsx` - Table density toggle
- `pagination.tsx` - Pagination controls
- `search-bar.tsx` - Search input with filters
- `confirm-dialog.tsx` - Confirmation dialog
- `avatar-uploader.tsx` - Avatar upload component

**Code Example**:

```tsx
"use client";

import { Button } from "@/components/ui/button";
import { Stack } from "@/components/ui/stack";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  return (
    <Stack
      direction="horizontal"
      justify="center"
      gap="sm"
      className={cn("flex-wrap", className)}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      {/* Page numbers */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </Stack>
  );
}
```

### Layer 3: Dashboard Shell Components (`components/dashboard/`)

**Purpose**: Application layout and chrome components specific to the dashboard.

**Rules**:

- ✅ MUST be built from Layer 1 and Layer 2 components
- ✅ CAN use Zustand stores for layout state (sidebar collapse, etc.)
- ✅ CAN use authentication context (user info, role)
- ✅ CAN implement navigation logic
- ❌ MUST NOT contain feature-specific business logic
- ❌ MUST NOT directly manipulate feature data

**Examples**:

- `sidebar.tsx` - Dashboard sidebar navigation
- `sidebar-layout.tsx` - Two-column layout with sidebar
- `dashboard-shell.tsx` - Dashboard page wrapper
- `user-menu.tsx` - User dropdown menu
- `header.tsx` - Dashboard header

**Code Example**:

```tsx
"use client";

import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/stores/sidebar.store";

interface SidebarLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export const SidebarLayout = ({ sidebar, children }: SidebarLayoutProps) => {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="flex h-screen overflow-hidden">
      <aside
        className={cn(
          "shrink-0 overflow-y-auto border-r border-border bg-sidebar-bg transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {sidebar}
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};
```

### Layer 4: Feature-Specific Components (`components/features/<feature>/`)

**Purpose**: Components that contain business logic and domain-specific functionality.

**Rules**:

- ✅ MUST be organized by feature in subdirectories
- ✅ CAN use all lower layers (ui, shared, dashboard)
- ✅ CAN contain business logic
- ✅ CAN use Zod schemas for validation
- ✅ CAN use TanStack Query for data fetching
- ✅ CAN use Supabase client
- ✅ CAN use API routes
- ✅ CAN implement complex state management
- ❌ SHOULD NOT be reused across unrelated features

**Examples**:

- `features/items/item-form.tsx` - Item CRUD form
- `features/items/item-card.tsx` - Item display card
- `features/items/item-table.tsx` - Items data table
- `features/upload/image-upload-form.tsx` - Image upload with ImageKit
- `features/users/user-form.tsx` - User management form

**Code Example**:

```tsx
"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { itemSchema, type ItemInput } from "@/lib/zod/schemas";
import { useToast } from "@/hooks/use-toast";

interface ItemFormProps {
  item?: Item;
  mode: "create" | "edit";
}

export function ItemForm({ item, mode }: ItemFormProps) {
  const [formData, setFormData] = useState<ItemInput>({
    title: item?.title || "",
    description: item?.description || "",
    status: item?.status || "active",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: ItemInput) => {
      const response = await fetch(
        mode === "create" ? "/api/items" : `/api/items/${item?.id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error("Failed to save item");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast({ title: "Success", description: "Item saved successfully" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = itemSchema.safeParse(formData);
    if (!validation.success) {
      toast({ title: "Validation Error", variant: "destructive" });
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === "create" ? "Create Item" : "Edit Item"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

## MCP ShadCN Enforcement Rules

### ✅ DO: Use ShadCN/Radix UI Primitives

```tsx
// ✅ CORRECT
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";

<Button variant="primary">Click me</Button>
<Input placeholder="Enter text" />
<Dialog>
  <DialogContent>Modal content</DialogContent>
</Dialog>
```

### ❌ DON'T: Use Raw HTML Elements in Atomic UI

```tsx
// ❌ WRONG - Don't use raw HTML in atomic UI components
<button className="...">Click me</button>
<input className="..." />
<div role="dialog">Modal content</div>
```

### Exception: Layout Components

Layout components (Container, Grid, Stack, Section) can use native HTML elements as they are non-interactive primitives:

```tsx
// ✅ ACCEPTABLE for layout primitives
export const Container = ({ children, className }) => (
  <div className={cn("mx-auto max-w-7xl px-4", className)}>{children}</div>
);
```

## Routing Rules for AI Code Generation

When generating or modifying components, follow these routing rules:

| Component Type     | Location                         | Key Characteristics                      |
| ------------------ | -------------------------------- | ---------------------------------------- |
| Primitive UI       | `components/ui/`                 | Uses Radix primitives, no business logic |
| Composite Reusable | `components/shared/`             | Built from primitives, no domain logic   |
| Layout/Shell       | `components/dashboard/`          | App chrome, navigation, layout           |
| Feature-Specific   | `components/features/<feature>/` | Business logic, API calls, domain code   |

### Decision Tree

```
Is it a primitive UI element (button, input, card)?
├─ YES → components/ui/
└─ NO
    ├─ Is it reusable across features without business logic?
    │   ├─ YES → components/shared/
    │   └─ NO
    │       ├─ Is it part of the app shell/layout?
    │       │   ├─ YES → components/dashboard/
    │       │   └─ NO → components/features/<feature>/
```

## Code Style Checklist

Every component MUST follow these rules:

### 1. Accept `className` Prop

```tsx
interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  // className is inherited from HTMLAttributes
}
```

### 2. Use `forwardRef` (where appropriate)

```tsx
const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("base-classes", className)} {...props} />
    );
  }
);
Component.displayName = "Component";
```

### 3. Support `asChild` Pattern (for interactive components)

```tsx
import { Slot } from "@radix-ui/react-slot";

interface ButtonProps {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} {...props} />;
  }
);
```

### 4. Use `cn()` for ClassName Merging

```tsx
import { cn } from "@/lib/utils";

<div className={cn("base-classes", variant && "variant-classes", className)} />;
```

### 5. Use Theme Tokens

```tsx
// ✅ CORRECT - Use theme tokens
<div className="bg-primary text-foreground border-border" />
<div className="bg-[hsl(var(--primary))]" />

// ❌ WRONG - Don't use hardcoded colors
<div className="bg-blue-500 text-gray-900" />
```

### 6. Export Component and Variants

```tsx
export { Button, buttonVariants };
export { Card, CardHeader, CardContent, cardVariants };
```

## File Naming Conventions

- **Components**: `component-name.tsx` (kebab-case)
- **Hooks**: `use-*.ts` (prefix with "use-")
- **Stores**: `*.store.ts` (suffix with ".store")
- **Types**: `*.types.ts` or `*.d.ts`
- **Index files**: `index.ts` (barrel exports)

## Import Conventions

Use absolute imports via path aliases:

```tsx
// ✅ CORRECT
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/data-table";
import { ItemForm } from "@/components/features/items/item-form";

// ❌ WRONG
import { Button } from "../../components/ui/button";
```

## Component Organization Example

```
components/
├── ui/                              # Atomic UI primitives
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── tooltip.tsx
│   ├── container.tsx
│   ├── grid.tsx
│   ├── stack.tsx
│   ├── section.tsx
│   └── index.ts
├── shared/                          # Composite reusable
│   ├── data-table/
│   │   ├── data-table.tsx
│   │   ├── density-toggle.tsx
│   │   ├── index.ts
│   │   └── README.md
│   ├── pagination.tsx
│   ├── search-bar.tsx
│   └── index.ts
├── dashboard/                       # Dashboard shell
│   ├── sidebar.tsx
│   ├── sidebar-layout.tsx
│   ├── dashboard-shell.tsx
│   ├── user-menu.tsx
│   └── index.ts
├── features/                        # Feature-specific
│   ├── items/
│   │   ├── item-form.tsx
│   │   ├── item-card.tsx
│   │   ├── item-table.tsx
│   │   └── index.ts
│   ├── upload/
│   │   ├── image-upload-form.tsx
│   │   ├── index.ts
│   │   └── README.md
│   └── index.ts
├── icons/                           # Icon registry
│   ├── registry.ts
│   └── index.ts
└── rbac/                            # RBAC utilities
    ├── can.tsx
    ├── can-any.tsx
    ├── can-all.tsx
    └── index.ts
```

## Testing Strategy

### Unit Tests

- Test atomic UI components in isolation
- Test variants and props
- Test accessibility

### Integration Tests

- Test composite components with their dependencies
- Test feature components with mocked APIs
- Test user interactions

### Visual Regression Tests

- Use Storybook for visual testing
- Test all component variants
- Test responsive behavior

## Migration Guide

If you have existing components that don't follow this architecture:

1. **Identify the layer** - Determine which layer the component belongs to
2. **Move the file** - Move to the appropriate directory
3. **Update imports** - Update all import paths
4. **Verify patterns** - Ensure className, forwardRef, asChild support
5. **Update index files** - Add exports to index.ts
6. **Run tests** - Verify nothing broke

## Summary

This layered architecture ensures:

- ✅ **Maintainability** - Clear separation of concerns
- ✅ **Scalability** - Easy to add new features
- ✅ **Consistency** - Uniform patterns across codebase
- ✅ **Reusability** - Components can be composed effectively
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Accessibility** - Built on Radix UI primitives
- ✅ **Theming** - Consistent use of design tokens

Follow these rules to build a robust, maintainable component architecture.
