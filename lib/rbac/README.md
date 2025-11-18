# RBAC Permission Engine

This module provides a comprehensive Role-Based Access Control (RBAC) system for managing user permissions.

## Features

- **Role-based permissions**: Pre-defined permissions for each role (owner, admin, manager, editor, viewer)
- **Custom permissions**: Support for user-specific permissions beyond role defaults
- **Permission checking utilities**: Functions to check single, any, or all permissions
- **Resource ownership**: Support for checking permissions on owned resources

## Roles

The system supports five roles with hierarchical permissions:

1. **Owner**: Full access to all features and settings
2. **Admin**: Most permissions except user deletion and role management
3. **Manager**: Can manage items and view users
4. **Editor**: Can create and manage their own items
5. **Viewer**: Read-only access to items

## Available Permissions

### Item Permissions

- `items:view` - View items
- `items:create` - Create new items
- `items:update` - Update own items
- `items:delete` - Delete own items
- `items:update:any` - Update any items in tenant
- `items:delete:any` - Delete any items in tenant

### User Permissions

- `users:view` - View users
- `users:create` - Create new users
- `users:update` - Update user profiles
- `users:delete` - Delete users
- `users:manage:roles` - Manage user roles

### Settings Permissions

- `settings:view` - View settings
- `settings:update` - Update settings

### Analytics Permissions

- `analytics:view` - View analytics

## Usage Examples

### Basic Permission Check

```typescript
import { hasPermission, PERMISSIONS } from "@/lib/rbac";

// Check if user can create items
if (hasPermission(user, PERMISSIONS.ITEMS_CREATE)) {
  // Show create button
}
```

### Check Multiple Permissions (Any)

```typescript
import { hasAnyPermission, PERMISSIONS } from "@/lib/rbac";

// Check if user can update OR delete items
if (
  hasAnyPermission(user, [PERMISSIONS.ITEMS_UPDATE, PERMISSIONS.ITEMS_DELETE])
) {
  // Show edit menu
}
```

### Check Multiple Permissions (All)

```typescript
import { hasAllPermissions, PERMISSIONS } from "@/lib/rbac";

// Check if user has both permissions
if (
  hasAllPermissions(user, [PERMISSIONS.USERS_VIEW, PERMISSIONS.USERS_UPDATE])
) {
  // Show user management interface
}
```

### Check Permission on Resource

```typescript
import { canPerformAction, PERMISSIONS } from "@/lib/rbac";

// Check if user can update a specific item
if (canPerformAction(user, PERMISSIONS.ITEMS_UPDATE, item.user_id)) {
  // User can update (either owns it or has items:update:any permission)
}
```

### Get All User Permissions

```typescript
import { getUserPermissions } from "@/lib/rbac";

const permissions = getUserPermissions(user);
console.log("User has permissions:", permissions);
```

## Integration with Components

### Server Components

```typescript
import { createClient } from "@/lib/supabase/server";
import { hasPermission, PERMISSIONS } from "@/lib/rbac";

export default async function ItemsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const canCreate = hasPermission(profile, PERMISSIONS.ITEMS_CREATE);

  return (
    <div>
      {canCreate && <CreateItemButton />}
      <ItemsList />
    </div>
  );
}
```

### Client Components

```typescript
"use client";

import { useUser } from "@/hooks/use-user";
import { hasPermission, PERMISSIONS } from "@/lib/rbac";

export function ItemActions({ item }) {
  const { user } = useUser();

  const canUpdate = hasPermission(user, PERMISSIONS.ITEMS_UPDATE);
  const canDelete = hasPermission(user, PERMISSIONS.ITEMS_DELETE);

  return (
    <div>
      {canUpdate && <EditButton itemId={item.id} />}
      {canDelete && <DeleteButton itemId={item.id} />}
    </div>
  );
}
```

## Custom Permissions

Users can have custom permissions beyond their role defaults. These are stored in the `permissions` array in the profiles table:

```typescript
// User with editor role but granted additional permission
const user = {
  id: "123",
  role: "editor",
  permissions: ["analytics:view"], // Custom permission
  tenant_id: "default",
};

// This user can view analytics even though editors normally can't
hasPermission(user, PERMISSIONS.ANALYTICS_VIEW); // true
```

## Role Permissions Matrix

| Permission         | Owner | Admin | Manager | Editor | Viewer |
| ------------------ | ----- | ----- | ------- | ------ | ------ |
| items:view         | ✓     | ✓     | ✓       | ✓      | ✓      |
| items:create       | ✓     | ✓     | ✓       | ✓      | ✗      |
| items:update       | ✓     | ✓     | ✓       | ✓      | ✗      |
| items:delete       | ✓     | ✓     | ✓       | ✓      | ✗      |
| items:update:any   | ✓     | ✓     | ✗       | ✗      | ✗      |
| items:delete:any   | ✓     | ✓     | ✗       | ✗      | ✗      |
| users:view         | ✓     | ✓     | ✓       | ✗      | ✗      |
| users:create       | ✓     | ✓     | ✗       | ✗      | ✗      |
| users:update       | ✓     | ✓     | ✗       | ✗      | ✗      |
| users:delete       | ✓     | ✗     | ✗       | ✗      | ✗      |
| users:manage:roles | ✓     | ✗     | ✗       | ✗      | ✗      |
| settings:view      | ✓     | ✓     | ✓       | ✓      | ✓      |
| settings:update    | ✓     | ✓     | ✗       | ✗      | ✗      |
| analytics:view     | ✓     | ✓     | ✓       | ✗      | ✗      |

## RBAC Middleware

The RBAC middleware provides automatic route protection based on user roles and permissions. It integrates with NextJS middleware to check authentication and authorization before rendering pages.

### Basic Usage

The middleware is already configured in `middleware.ts` with default settings:

```typescript
import { rbacMiddleware } from "@/lib/rbac/middleware";

export async function middleware(request: NextRequest) {
  return await rbacMiddleware(request);
}
```

### Default Protected Routes

By default, the following routes are protected:

- `/dashboard` - Requires authentication
- `/dashboard/users` - Requires `users:view` permission
- `/dashboard/settings` - Requires `settings:view` permission
- `/dashboard/analytics` - Requires `analytics:view` permission

### Custom Route Configuration

You can customize route protection by creating a custom middleware instance:

```typescript
import { createRBACMiddleware } from "@/lib/rbac/middleware";
import { PERMISSIONS } from "@/lib/rbac";

const customMiddleware = createRBACMiddleware({
  routes: [
    {
      path: "/dashboard",
      requireAuth: true,
    },
    {
      path: "/dashboard/admin/*",
      roles: ["owner", "admin"],
    },
    {
      path: "/dashboard/items/create",
      permissions: [PERMISSIONS.ITEMS_CREATE],
    },
  ],
  signInPath: "/login",
  forbiddenPath: "/forbidden",
  publicPaths: ["/", "/about", "/contact"],
});
```

### Route Configuration Options

Each route can have the following options:

- `path` (required): Path pattern to match (supports wildcards with `*`)
- `permissions`: Array of permissions (user must have at least one)
- `roles`: Array of roles (user must have one of these roles)
- `requireAuth`: Whether authentication is required (default: true)

### Middleware Behavior

1. **Unauthenticated users**: Redirected to sign-in page with return URL
2. **Unauthorized users**: Redirected to 403 forbidden page
3. **Authorized users**: Allowed to access the route

### Path Matching

The middleware supports three types of path matching:

1. **Exact match**: `/dashboard/users` matches only `/dashboard/users`
2. **Wildcard match**: `/dashboard/*` matches all paths under `/dashboard/`
3. **Prefix match**: `/dashboard` matches `/dashboard` and `/dashboard/*`

### Example: Protecting Admin Routes

```typescript
const routes = [
  {
    path: "/dashboard/admin/*",
    roles: ["owner", "admin"],
  },
  {
    path: "/dashboard/users/*/edit",
    permissions: [PERMISSIONS.USERS_UPDATE],
  },
];
```

### Example: Mixed Requirements

```typescript
const routes = [
  {
    path: "/dashboard/reports",
    permissions: [PERMISSIONS.ANALYTICS_VIEW],
    roles: ["manager", "admin", "owner"],
  },
];
```

## Best Practices

1. **Always check permissions on both client and server**: Client-side checks improve UX, but server-side checks ensure security
2. **Use the most specific permission**: Prefer `items:update` over checking role directly
3. **Combine with RLS policies**: The database RLS policies provide an additional security layer
4. **Grant custom permissions sparingly**: Use role-based permissions as the primary mechanism
5. **Check resource ownership**: Use `canPerformAction` when dealing with user-owned resources
6. **Configure middleware routes**: Define clear route protection rules in the middleware configuration
7. **Use wildcards wisely**: Wildcard routes can protect entire sections of your app
