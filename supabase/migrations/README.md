# Database Migrations

This directory contains SQL migration files for setting up the Supabase database schema with Row Level Security (RLS) and Role-Based Access Control (RBAC).

## Migration Files

### 1. `20241118000001_create_profiles_table.sql`

Creates the `profiles` table that extends `auth.users` with additional user information.

**Features:**

- User profile data (email, full_name, avatar_url)
- Automatic timestamps (created_at, updated_at)
- RLS policies for viewing and updating own profile
- Automatic profile creation on user signup via trigger
- Automatic updated_at timestamp updates

**RLS Policies:**

- Users can view their own profile
- Users can insert their own profile (during signup)
- Users can update their own profile

### 2. `20241118000002_create_items_table.sql`

Creates the `items` table for demonstrating CRUD operations.

**Features:**

- Item data (title, description, image_url, status)
- User ownership via user_id foreign key
- Status validation (active, inactive, archived)
- Automatic timestamps (created_at, updated_at)
- Indexes for performance optimization

**RLS Policies:**

- Users can view their own items
- Users can insert their own items
- Users can update their own items
- Users can delete their own items

### 3. `20241118000003_add_rbac_support.sql`

Adds Role-Based Access Control (RBAC) and multi-tenant support.

**Features:**

- Role system (owner, admin, manager, editor, viewer)
- Multi-tenant isolation via tenant_id
- Permission-based access control
- Enhanced RLS policies with role and tenant checks
- Helper functions for permission checking

**Roles:**

- `owner`: Full access to all resources in tenant
- `admin`: Full access to all resources in tenant
- `manager`: Can view and manage items, view users
- `editor`: Can create and edit own items
- `viewer`: Can only view items

**RLS Policies:**

- Tenant isolation (users can only access data in their tenant)
- Role-based access (different permissions per role)
- Permission-based access (fine-grained control)
- Admins can manage all resources in their tenant
- Users can manage their own resources

**Helper Functions:**

- `has_permission(user_id, permission)`: Check if user has a specific permission
- `get_user_role(user_id)`: Get user's role
- `get_user_tenant(user_id)`: Get user's tenant

## Running Migrations

### Option 1: Using Supabase CLI (Recommended)

1. Install Supabase CLI:

```bash
npm install -g supabase
```

2. Link to your Supabase project:

```bash
supabase link --project-ref your-project-ref
```

3. Run migrations:

```bash
supabase db push
```

### Option 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste each migration file in order
4. Execute each migration

### Option 3: Manual Execution

If you're using a local Supabase instance:

```bash
# Start local Supabase
supabase start

# Apply migrations
supabase db reset
```

## Migration Order

**IMPORTANT:** Migrations must be run in order:

1. `20241118000001_create_profiles_table.sql` (creates profiles table and triggers)
2. `20241118000002_create_items_table.sql` (creates items table)
3. `20241118000003_add_rbac_support.sql` (adds RBAC support)

## Generating TypeScript Types

After running migrations, generate TypeScript types:

```bash
# For remote project
supabase gen types typescript --project-id your-project-ref > types/database.types.ts

# For local project
supabase gen types typescript --local > types/database.types.ts
```

## Testing RLS Policies

You can test RLS policies in the Supabase SQL Editor:

```sql
-- Test as a specific user
SET request.jwt.claims.sub = 'user-uuid-here';

-- Try to select items
SELECT * FROM public.items;

-- Try to insert an item
INSERT INTO public.items (user_id, title, status)
VALUES ('user-uuid-here', 'Test Item', 'active');
```

## Default User Roles

When users sign up, they are assigned the `viewer` role by default. To change a user's role:

```sql
-- Update user role (must be done by an admin)
UPDATE public.profiles
SET role = 'editor'
WHERE id = 'user-uuid-here';
```

## Multi-Tenant Setup

All users are assigned to the `default` tenant by default. To create a new tenant:

```sql
-- Update user's tenant
UPDATE public.profiles
SET tenant_id = 'org_123'
WHERE id = 'user-uuid-here';

-- Update existing items to new tenant
UPDATE public.items
SET tenant_id = 'org_123'
WHERE user_id = 'user-uuid-here';
```

## Troubleshooting

### RLS Policies Not Working

If RLS policies aren't working as expected:

1. Verify RLS is enabled:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

2. Check policy definitions:

```sql
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

3. Test with service role key (bypasses RLS):

```typescript
const supabase = createClient(url, serviceRoleKey);
```

### Migration Errors

If you encounter errors during migration:

1. Check if tables already exist
2. Verify foreign key constraints
3. Ensure auth.users table exists
4. Check for conflicting policy names

### Permission Issues

If users can't access data they should be able to:

1. Verify user's role in profiles table
2. Check tenant_id matches
3. Verify RLS policies are correct
4. Test with SQL Editor using SET request.jwt.claims

## Security Best Practices

1. **Always enable RLS** on tables containing user data
2. **Test policies thoroughly** before deploying to production
3. **Use service role key carefully** - it bypasses RLS
4. **Validate inputs** in application code before database operations
5. **Audit role changes** - log when users' roles are modified
6. **Implement rate limiting** on authentication endpoints
7. **Review policies regularly** as requirements change

## Additional Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase CLI Documentation](https://supabase.com/docs/reference/cli)
