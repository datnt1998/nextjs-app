# RBAC Components

Permission-based rendering components for implementing Role-Based Access Control in the UI.

## Components

### Can

Conditionally renders children based on a single permission check.

**Props:**

- `permission` (required): The permission required to render children
- `children` (required): Content to render when user has the permission
- `fallback` (optional): Content to render when user lacks the permission (default: null)

**Usage:**

```tsx
import { Can } from "@/components/rbac";
import { PERMISSIONS } from "@/lib/rbac";

// Hide component when user lacks permission
<Can permission={PERMISSIONS.ITEMS_CREATE}>
  <Button>Add Item</Button>
</Can>

// Show fallback when user lacks permission
<Can
  permission={PERMISSIONS.ITEMS_DELETE}
  fallback={<p>You don't have permission to delete items</p>}
>
  <Button variant="danger">Delete</Button>
</Can>
```

### CanAny

Conditionally renders children if the user has ANY of the specified permissions (OR logic).

**Props:**

- `permissions` (required): Array of permissions - user must have at least one
- `children` (required): Content to render when user has at least one permission
- `fallback` (optional): Content to render when user lacks all permissions (default: null)

**Usage:**

```tsx
import { CanAny } from "@/components/rbac";
import { PERMISSIONS } from "@/lib/rbac";

// Show edit menu if user can update OR delete
<CanAny permissions={[PERMISSIONS.ITEMS_UPDATE, PERMISSIONS.ITEMS_DELETE]}>
  <EditMenu />
</CanAny>

// With fallback
<CanAny
  permissions={[PERMISSIONS.USERS_VIEW, PERMISSIONS.USERS_UPDATE]}
  fallback={<p>No user management access</p>}
>
  <UserManagementPanel />
</CanAny>
```

### CanAll

Conditionally renders children if the user has ALL of the specified permissions (AND logic).

**Props:**

- `permissions` (required): Array of permissions - user must have all of them
- `children` (required): Content to render when user has all permissions
- `fallback` (optional): Content to render when user lacks any permission (default: null)

**Usage:**

```tsx
import { CanAll } from "@/components/rbac";
import { PERMISSIONS } from "@/lib/rbac";

// Show admin panel only if user has both permissions
<CanAll permissions={[PERMISSIONS.USERS_VIEW, PERMISSIONS.USERS_UPDATE]}>
  <AdminPanel />
</CanAll>

// With fallback
<CanAll
  permissions={[PERMISSIONS.SETTINGS_VIEW, PERMISSIONS.SETTINGS_UPDATE]}
  fallback={<p>Full settings access required</p>}
>
  <SettingsEditor />
</CanAll>
```

## Common Patterns

### Conditional Button Rendering

```tsx
import { Can } from "@/components/rbac";
import { PERMISSIONS } from "@/lib/rbac";
import { Button } from "@/components/ui/button";

export function ItemActions({ item }) {
  return (
    <div className="flex gap-2">
      <Can permission={PERMISSIONS.ITEMS_UPDATE}>
        <Button onClick={() => handleEdit(item)}>Edit</Button>
      </Can>

      <Can permission={PERMISSIONS.ITEMS_DELETE}>
        <Button variant="danger" onClick={() => handleDelete(item)}>
          Delete
        </Button>
      </Can>
    </div>
  );
}
```

### Conditional Section Rendering

```tsx
import { Can } from "@/components/rbac";
import { PERMISSIONS } from "@/lib/rbac";

export function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      <Can permission={PERMISSIONS.ANALYTICS_VIEW}>
        <AnalyticsSection />
      </Can>

      <Can permission={PERMISSIONS.USERS_VIEW}>
        <UsersSection />
      </Can>
    </div>
  );
}
```

### Disabled State with Permission Check

For cases where you want to show a disabled button instead of hiding it:

```tsx
import { useUserStore } from "@/stores/user.store";
import { hasPermission, PERMISSIONS } from "@/lib/rbac";
import { Button } from "@/components/ui/button";

export function CreateItemButton() {
  const user = useUserStore((state) => state.user);

  const userProfile = user
    ? {
        id: user.id,
        role: user.role,
        permissions: user.permissions,
        tenant_id: user.tenant_id,
      }
    : null;

  const canCreate = hasPermission(userProfile, PERMISSIONS.ITEMS_CREATE);

  return (
    <Button disabled={!canCreate} onClick={handleCreate}>
      Create Item
    </Button>
  );
}
```

### Complex Permission Logic

```tsx
import { CanAny, CanAll } from "@/components/rbac";
import { PERMISSIONS } from "@/lib/rbac";

export function ComplexFeature() {
  return (
    <div>
      {/* Show if user has ANY of these permissions */}
      <CanAny
        permissions={[PERMISSIONS.ITEMS_UPDATE, PERMISSIONS.ITEMS_DELETE]}
      >
        <ItemManagementTools />
      </CanAny>

      {/* Show only if user has ALL of these permissions */}
      <CanAll
        permissions={[
          PERMISSIONS.USERS_VIEW,
          PERMISSIONS.USERS_UPDATE,
          PERMISSIONS.USERS_DELETE,
        ]}
      >
        <FullUserManagement />
      </CanAll>
    </div>
  );
}
```

## Integration with Other RBAC Features

These components work seamlessly with the rest of the RBAC system:

- **Permission Engine** (`@/lib/rbac/permissions`): Provides the permission checking logic
- **RBAC Middleware** (`@/lib/rbac/middleware`): Protects routes at the page level
- **User Store** (`@/stores/user.store`): Provides the current user's role and permissions
- **Database RLS**: Provides an additional security layer at the database level

## Best Practices

1. **Use for UI rendering only**: These components control what users see, but always validate permissions on the server side as well
2. **Prefer specific permissions**: Use `PERMISSIONS.ITEMS_CREATE` instead of checking roles directly
3. **Combine with disabled states**: For better UX, consider showing disabled buttons instead of hiding them completely
4. **Use fallback for important features**: Provide helpful messages when users lack permissions
5. **Keep permission checks simple**: If you need complex logic, consider creating a custom hook
6. **Server-side validation is required**: Client-side permission checks improve UX but don't replace server-side security

## Related Documentation

- [RBAC Permission Engine](../../lib/rbac/README.md)
- [User Store](../../stores/user.store.ts)
- [RBAC Middleware](../../lib/rbac/middleware.ts)
