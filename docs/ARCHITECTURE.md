# Component Architecture

Complete guide to the layered component architecture.

## Overview

Four-layer architecture for maintainability and scalability:

```
components/
├── ui/                    # Layer 1: Atomic UI primitives
├── shared/                # Layer 2: Composite reusable
├── dashboard/             # Layer 3: Dashboard shell
└── features/              # Layer 4: Feature-specific
```

## Layer Definitions

### Layer 1: Atomic UI (`components/ui/`)

**Purpose:** Primitive UI elements (buttons, inputs, cards)

**Rules:**

- ✅ Use ShadCN/Radix UI primitives
- ✅ Support `className`, `forwardRef`, `asChild`
- ✅ Use theme tokens
- ❌ No business logic
- ❌ No domain-specific code

**Example:**

```tsx
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp ref={ref} className={cn("base-classes", className)} {...props} />
    );
  }
);
```

### Layer 2: Shared Reusable (`components/shared/`)

**Purpose:** Composite components reusable across features

**Rules:**

- ✅ Built from Layer 1 components
- ✅ Support `className`, `forwardRef`
- ✅ Can use external libraries (TanStack Table)
- ❌ No business logic
- ❌ No API/database access

**Example:**

```tsx
import { Button } from "@/components/ui/button";

export function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div>
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
}
```

### Layer 3: Dashboard Shell (`components/dashboard/`)

**Purpose:** App layout and navigation

**Rules:**

- ✅ Built from Layers 1 & 2
- ✅ Can use auth context
- ✅ Can implement navigation
- ❌ No feature-specific logic

**Example:**

```tsx
import { cn } from "@/lib/utils";

export function SidebarLayout({ sidebar, children }) {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="flex h-screen">
      <aside className={cn("transition-all", isCollapsed ? "w-16" : "w-64")}>
        {sidebar}
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

### Layer 4: Feature-Specific (`components/features/<feature>/`)

**Purpose:** Domain-specific components with business logic

**Rules:**

- ✅ Can use all layers
- ✅ Can contain business logic
- ✅ Can use APIs, databases
- ✅ Can use TanStack Query, Zod

**Example:**

```tsx
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export function ItemForm({ item, mode }) {
  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch(
        `/api/items${mode === "edit" ? `/${item.id}` : ""}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          body: JSON.stringify(data),
        }
      );
      return response.json();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate(formData);
      }}
    >
      {/* form fields */}
      <Button type="submit">{mutation.isPending ? "Saving..." : "Save"}</Button>
    </form>
  );
}
```

## Component Routing

| Type               | Location                         | Characteristics            |
| ------------------ | -------------------------------- | -------------------------- |
| Primitive UI       | `components/ui/`                 | Radix primitives, no logic |
| Composite Reusable | `components/shared/`             | Built from primitives      |
| Layout/Shell       | `components/dashboard/`          | App chrome, navigation     |
| Feature-Specific   | `components/features/<feature>/` | Business logic, APIs       |

**Decision Tree:**

```
Is it a primitive (button, input, card)?
├─ YES → components/ui/
└─ NO
    ├─ Reusable across features without business logic?
    │   ├─ YES → components/shared/
    │   └─ NO
    │       ├─ Part of app shell/layout?
    │       │   ├─ YES → components/dashboard/
    │       │   └─ NO → components/features/<feature>/
```

## Code Standards

### Required Patterns

1. **className Prop**

```tsx
interface Props extends React.HTMLAttributes<HTMLDivElement> {
  // className inherited
}
```

2. **forwardRef**

```tsx
const Component = React.forwardRef<HTMLDivElement, Props>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("base", className)} {...props} />
  )
);
Component.displayName = "Component";
```

3. **asChild Pattern** (interactive components)

```tsx
import { Slot } from "@radix-ui/react-slot";

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} {...props} />;
  }
);
```

4. **Theme Tokens**

```tsx
// ✅ Correct
<div className="bg-primary text-foreground" />

// ❌ Wrong
<div className="bg-blue-500 text-gray-900" />
```

### File Naming

- Components: `component-name.tsx` (kebab-case)
- Hooks: `use-*.ts`
- Stores: `*.store.ts`
- Types: `*.types.ts`
- Index: `index.ts`

### Import Conventions

```tsx
// ✅ Correct - absolute imports
import { Button } from "@/components/ui/button";

// ❌ Wrong - relative imports
import { Button } from "../../components/ui/button";
```

## Current Structure

```
components/
├── ui/                    # Atomic UI primitives
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── index.ts
├── shared/                # Composite reusable
│   ├── data-table/
│   │   ├── data-table.tsx
│   │   ├── density-toggle.tsx
│   │   └── index.ts
│   ├── pagination.tsx
│   └── index.ts
├── dashboard/             # Dashboard shell
│   ├── sidebar.tsx
│   ├── sidebar-layout.tsx
│   ├── dashboard-shell.tsx
│   └── index.ts
├── features/              # Feature-specific
│   ├── items/
│   │   ├── item-form.tsx
│   │   └── index.ts
│   ├── upload/
│   │   ├── image-upload-form.tsx
│   │   └── index.ts
│   └── index.ts
├── icons/                 # Icon registry
└── rbac/                  # RBAC utilities
```

## Verification Status

All atomic UI components verified:

| Component     | Radix Primitive | forwardRef | className | asChild | Status |
| ------------- | --------------- | ---------- | --------- | ------- | ------ |
| Button        | Slot            | ✅         | ✅        | ✅      | ✅     |
| Dialog        | Dialog          | ✅         | ✅        | N/A     | ✅     |
| Dropdown Menu | Dropdown Menu   | ✅         | ✅        | N/A     | ✅     |
| Tooltip       | Tooltip         | ✅         | ✅        | N/A     | ✅     |
| Input         | Native HTML     | ✅         | ✅        | N/A     | ✅     |
| Card          | Native HTML     | ✅         | ✅        | N/A     | ✅     |
| Container     | Native HTML     | ✅         | ✅        | N/A     | ✅     |

**All components COMPLIANT**

## Migration History

### Refactoring (Completed)

**Data Table Reorganization:**

- Moved `data-table.tsx` → `shared/data-table/`
- Moved `density-toggle.tsx` → `shared/data-table/`
- Created dedicated folder for coupled components

**Component Moves:**

- `sidebar-layout.tsx` → `dashboard/`
- `dashboard-shell.tsx` → `dashboard/`
- `item-form.tsx` → `features/items/`
- `image-upload-form.tsx` → `features/upload/`

**Enhancements:**

- Added `forwardRef` to all layout primitives
- Created barrel exports (`index.ts`)
- Updated all import paths
- Verified TypeScript compliance

## Testing Strategy

- **Unit Tests:** Test atomic UI in isolation
- **Integration Tests:** Test composites with dependencies
- **Visual Tests:** Use Storybook for variants

## Migration Guide

To migrate existing components:

1. Identify correct layer
2. Move file to appropriate directory
3. Update import paths
4. Verify patterns (className, forwardRef, asChild)
5. Add to index.ts
6. Run tests

## Benefits

- ✅ Clear separation of concerns
- ✅ Easy to add features
- ✅ Consistent patterns
- ✅ Type-safe
- ✅ Accessible (Radix UI)
- ✅ Themeable
