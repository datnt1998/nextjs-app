# Component Architecture Audit

This document classifies all existing components according to the layered architecture defined in the design document.

## Architecture Layers

1. **Atomic UI components** (primitive) - `components/ui/`
2. **Shared reusable components** (composite) - `components/shared/`
3. **Dashboard shell components** (app layout) - `components/dashboard/`
4. **Feature-level components** (domain-specific) - `components/features/`

## Current Component Classification

### ✅ Atomic UI Components (components/ui/)

**Status: Correctly placed**

These are primitive UI elements built using ShadCN primitives:

- `button.tsx` - Button component with variants
- `card.tsx` - Card component with variants
- `input.tsx` - Input component with variants
- `dialog.tsx` - Dialog primitive
- `dropdown-menu.tsx` - Dropdown menu primitive
- `tooltip.tsx` - Tooltip primitive
- `toast.tsx` - Toast notification primitive
- `toaster.tsx` - Toast container
- `container.tsx` - Layout container primitive
- `section.tsx` - Section layout primitive
- `grid.tsx` - Grid layout primitive
- `stack.tsx` - Stack layout primitive

### ⚠️ Components That Need to Move

#### From `components/ui/` to `components/shared/`

**Reason: These are composite reusable components, not atomic primitives**

- `data-table.tsx` - Composite table component using TanStack Table
- `pagination.tsx` - Composite pagination component
- `density-toggle.tsx` - Composite toggle component using Zustand store

#### From `components/ui/` to `components/dashboard/`

**Reason: These are dashboard shell/layout components**

- `sidebar-layout.tsx` - Dashboard layout component
- `dashboard-shell.tsx` - Dashboard wrapper component

### ✅ Dashboard Components (components/dashboard/)

**Status: Correctly placed**

- `sidebar.tsx` - Dashboard sidebar navigation
- `user-menu.tsx` - User menu dropdown
- `index.ts` - Export file

### ⚠️ Feature Components That Need Organization

#### From `components/items/` to `components/features/items/`

**Reason: Feature-specific components should be under features directory**

- `item-form.tsx` - Item CRUD form (feature-specific)

#### From `components/upload/` to `components/features/upload/`

**Reason: Upload is a feature, not a shared component**

- `image-upload-form.tsx` - Image upload form (feature-specific)
- `index.ts` - Export file
- `README.md` - Documentation

### ✅ Other Components (Correctly Placed)

#### `components/icons/`

**Status: Correctly placed - Icon registry**

- `registry.ts` - Icon registry mapping
- `index.ts` - Export file

#### `components/rbac/`

**Status: Correctly placed - RBAC utilities**

- `can.tsx` - Permission check component
- `can-any.tsx` - Any permission check component
- `can-all.tsx` - All permissions check component
- `examples.tsx` - RBAC examples
- `index.ts` - Export file
- `README.md` - Documentation

#### `components/examples/`

**Status: Can be removed or kept as examples**

- `svg-example.tsx` - SVG usage example

## Required Actions

### 1. Create New Directories

- `components/shared/` - For composite reusable components
- `components/features/` - For feature-specific components
- `components/features/items/` - For items feature
- `components/features/upload/` - For upload feature

### 2. Move Components

#### To `components/shared/`:

- Move `components/ui/data-table.tsx` → `components/shared/data-table.tsx`
- Move `components/ui/pagination.tsx` → `components/shared/pagination.tsx`
- Move `components/ui/density-toggle.tsx` → `components/shared/density-toggle.tsx`
- Move `components/ui/data-table.README.md` → `components/shared/data-table.README.md`

#### To `components/dashboard/`:

- Move `components/ui/sidebar-layout.tsx` → `components/dashboard/sidebar-layout.tsx`
- Move `components/ui/dashboard-shell.tsx` → `components/dashboard/dashboard-shell.tsx`

#### To `components/features/items/`:

- Move `components/items/item-form.tsx` → `components/features/items/item-form.tsx`
- Remove `components/items/` directory after move

#### To `components/features/upload/`:

- Move `components/upload/image-upload-form.tsx` → `components/features/upload/image-upload-form.tsx`
- Move `components/upload/index.ts` → `components/features/upload/index.ts`
- Move `components/upload/README.md` → `components/features/upload/README.md`
- Remove `components/upload/` directory after move

### 3. Update Import Paths

All files importing moved components need to be updated:

#### Files importing `data-table.tsx`:

- `app/(dashboard)/dashboard/items/table/page.tsx`

#### Files importing `pagination.tsx`:

- `app/(dashboard)/dashboard/items/page.tsx`

#### Files importing `density-toggle.tsx`:

- `app/(dashboard)/dashboard/items/table/page.tsx`

#### Files importing `sidebar-layout.tsx`:

- `app/(dashboard)/layout.tsx`

#### Files importing `dashboard-shell.tsx`:

- `app/(dashboard)/dashboard/page.tsx`
- `app/(dashboard)/dashboard/items/page.tsx`
- `app/(dashboard)/dashboard/items/[id]/page.tsx`
- `app/(dashboard)/dashboard/items/[id]/edit/page.tsx`
- `app/(dashboard)/dashboard/items/new/page.tsx`
- `app/(dashboard)/dashboard/items/table/page.tsx`
- `app/(dashboard)/dashboard/upload/page.tsx`

#### Files importing `item-form.tsx`:

- `app/(dashboard)/dashboard/items/new/page.tsx`
- `app/(dashboard)/dashboard/items/[id]/edit/page.tsx`

#### Files importing `image-upload-form.tsx`:

- `app/(dashboard)/dashboard/upload/page.tsx`

### 4. Create Index Files

Create barrel exports for each directory:

- `components/shared/index.ts`
- `components/features/index.ts`
- `components/features/items/index.ts`
- `components/features/upload/index.ts`

### 5. Update `components/ui/index.ts`

Remove exports for moved components:

- Remove `data-table`
- Remove `pagination`
- Remove `density-toggle`
- Remove `sidebar-layout`
- Remove `dashboard-shell`

## Final Directory Structure

```
components/
├── ui/                          # Atomic UI primitives
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── tooltip.tsx
│   ├── toast.tsx
│   ├── toaster.tsx
│   ├── container.tsx
│   ├── section.tsx
│   ├── grid.tsx
│   ├── stack.tsx
│   └── index.ts
├── shared/                      # Composite reusable components
│   ├── data-table/
│   │   ├── data-table.tsx
│   │   ├── density-toggle.tsx
│   │   ├── index.ts
│   │   └── README.md
│   ├── pagination.tsx
│   └── index.ts
├── dashboard/                   # Dashboard shell components
│   ├── sidebar.tsx
│   ├── sidebar-layout.tsx
│   ├── dashboard-shell.tsx
│   ├── user-menu.tsx
│   └── index.ts
├── features/                    # Feature-specific components
│   ├── items/
│   │   ├── item-form.tsx
│   │   └── index.ts
│   ├── upload/
│   │   ├── image-upload-form.tsx
│   │   ├── index.ts
│   │   └── README.md
│   └── index.ts
├── icons/                       # Icon registry
│   ├── registry.ts
│   └── index.ts
├── rbac/                        # RBAC utilities
│   ├── can.tsx
│   ├── can-any.tsx
│   ├── can-all.tsx
│   ├── examples.tsx
│   ├── index.ts
│   └── README.md
└── examples/                    # Example components (optional)
    └── svg-example.tsx
```

## Verification Checklist

- [ ] All atomic UI components remain in `components/ui/`
- [ ] All composite reusable components moved to `components/shared/`
- [ ] All dashboard shell components moved to `components/dashboard/`
- [ ] All feature-specific components moved to `components/features/<feature>/`
- [ ] All import paths updated
- [ ] All index files created
- [ ] Build succeeds without errors
- [ ] Type checking passes
