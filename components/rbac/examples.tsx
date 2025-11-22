/**
 * RBAC Component Usage Examples
 *
 * This file contains example implementations of the RBAC components.
 * These examples demonstrate common patterns and best practices.
 *
 * NOTE: This file is for reference only and should not be imported in production code.
 */

import { Can, CanAll, CanAny } from "@/components/rbac";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PERMISSIONS } from "@/lib/rbac";

/**
 * Example 1: Basic permission check
 * Shows a create button only if user has permission
 */
export function Example1_BasicPermissionCheck() {
  return (
    <div>
      <h2>Items List</h2>

      <Can permission={PERMISSIONS.ITEMS_CREATE}>
        <Button>Create New Item</Button>
      </Can>

      {/* Item list content */}
    </div>
  );
}

/**
 * Example 2: Permission check with fallback
 * Shows a message when user lacks permission
 */
export function Example2_PermissionWithFallback() {
  return (
    <Can
      permission={PERMISSIONS.ANALYTICS_VIEW}
      fallback={
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">
              You don't have permission to view analytics. Contact your
              administrator for access.
            </p>
          </CardContent>
        </Card>
      }
    >
      <Card>
        <CardHeader>Analytics Dashboard</CardHeader>
        <CardContent>{/* Analytics content */}</CardContent>
      </Card>
    </Can>
  );
}

/**
 * Example 3: Multiple action buttons with different permissions
 * Each button is shown based on its required permission
 */
export function Example3_MultipleActions() {
  return (
    <div className="flex gap-2">
      <Can permission={PERMISSIONS.ITEMS_UPDATE}>
        <Button variant="outline">Edit</Button>
      </Can>

      <Can permission={PERMISSIONS.ITEMS_DELETE}>
        <Button variant="destructive">Delete</Button>
      </Can>

      <Can permission={PERMISSIONS.ITEMS_UPDATE_ANY}>
        <Button variant="secondary">Edit Any</Button>
      </Can>
    </div>
  );
}

/**
 * Example 4: CanAny - Show if user has ANY permission (OR logic)
 * Useful for features accessible by multiple permission types
 */
export function Example4_AnyPermission() {
  return (
    <CanAny
      permissions={[PERMISSIONS.ITEMS_UPDATE, PERMISSIONS.ITEMS_DELETE]}
      fallback={<p>You can only view items</p>}
    >
      <div>
        <h3>Item Management</h3>
        <p>You can modify items</p>
        {/* Management tools */}
      </div>
    </CanAny>
  );
}

/**
 * Example 5: CanAll - Show if user has ALL permissions (AND logic)
 * Useful for features requiring multiple permissions
 */
export function Example5_AllPermissions() {
  return (
    <CanAll
      permissions={[
        PERMISSIONS.USERS_VIEW,
        PERMISSIONS.USERS_UPDATE,
        PERMISSIONS.USERS_DELETE,
      ]}
      fallback={<p>Full user management access required</p>}
    >
      <div>
        <h3>Full User Management</h3>
        <Button>Add User</Button>
        <Button>Edit Users</Button>
        <Button variant="destructive">Delete Users</Button>
      </div>
    </CanAll>
  );
}

/**
 * Example 6: Nested permission checks
 * Combine multiple permission checks for complex UI
 */
export function Example6_NestedPermissions() {
  return (
    <div>
      <h2>Dashboard</h2>

      <Can permission={PERMISSIONS.ITEMS_VIEW}>
        <section>
          <h3>Items</h3>
          {/* Items list */}

          <Can permission={PERMISSIONS.ITEMS_CREATE}>
            <Button>Create Item</Button>
          </Can>
        </section>
      </Can>

      <Can permission={PERMISSIONS.USERS_VIEW}>
        <section>
          <h3>Users</h3>
          {/* Users list */}

          <CanAll
            permissions={[PERMISSIONS.USERS_CREATE, PERMISSIONS.USERS_UPDATE]}
          >
            <Button>Manage Users</Button>
          </CanAll>
        </section>
      </Can>
    </div>
  );
}

/**
 * Example 7: Conditional rendering in a table
 * Show action columns based on permissions
 */
export function Example7_TableActions() {
  const items = [
    { id: "1", name: "Item 1" },
    { id: "2", name: "Item 2" },
  ];

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <CanAny
            permissions={[PERMISSIONS.ITEMS_UPDATE, PERMISSIONS.ITEMS_DELETE]}
          >
            <th>Actions</th>
          </CanAny>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <CanAny
              permissions={[PERMISSIONS.ITEMS_UPDATE, PERMISSIONS.ITEMS_DELETE]}
            >
              <td>
                <div className="flex gap-2">
                  <Can permission={PERMISSIONS.ITEMS_UPDATE}>
                    <Button size="sm">Edit</Button>
                  </Can>
                  <Can permission={PERMISSIONS.ITEMS_DELETE}>
                    <Button size="sm" variant="destructive">
                      Delete
                    </Button>
                  </Can>
                </div>
              </td>
            </CanAny>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * Example 8: Settings page with multiple permission sections
 * Different sections require different permissions
 */
export function Example8_SettingsPage() {
  return (
    <div className="space-y-6">
      <h1>Settings</h1>

      <Can permission={PERMISSIONS.SETTINGS_VIEW}>
        <Card>
          <CardHeader>General Settings</CardHeader>
          <CardContent>
            <p>View general settings</p>

            <Can permission={PERMISSIONS.SETTINGS_UPDATE}>
              <Button>Save Changes</Button>
            </Can>
          </CardContent>
        </Card>
      </Can>

      <Can permission={PERMISSIONS.USERS_MANAGE_ROLES}>
        <Card>
          <CardHeader>Role Management</CardHeader>
          <CardContent>
            <p>Manage user roles and permissions</p>
            <Button>Configure Roles</Button>
          </CardContent>
        </Card>
      </Can>

      <CanAll
        permissions={[PERMISSIONS.SETTINGS_VIEW, PERMISSIONS.ANALYTICS_VIEW]}
      >
        <Card>
          <CardHeader>Advanced Analytics Settings</CardHeader>
          <CardContent>
            <p>Configure analytics tracking</p>
          </CardContent>
        </Card>
      </CanAll>
    </div>
  );
}
