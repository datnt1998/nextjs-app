# Supabase Setup Guide

This guide will help you set up Supabase for the NextJS Starter Kit with database schema, RLS policies, and RBAC support.

## Prerequisites

- Node.js 18+ installed
- Supabase account (sign up at https://supabase.com)
- Supabase CLI installed globally

## Quick Start

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Create a Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in project details:
   - Name: Your project name
   - Database Password: Strong password (save this!)
   - Region: Choose closest to your users
4. Wait for project to be created (~2 minutes)

### 3. Get Your Project Credentials

From your Supabase project dashboard:

1. Go to Settings → API
2. Copy the following:
   - Project URL (NEXT_PUBLIC_SUPABASE_URL)
   - Anon/Public Key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - Service Role Key (SUPABASE_SERVICE_ROLE_KEY) - Keep this secret!

### 4. Configure Environment Variables

Create a `.env.local` file in the `nextjs-app` directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ImageKit (optional for now)
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=
IMAGEKIT_PRIVATE_KEY=

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Run Database Migrations

#### Option A: Using Supabase Dashboard (Easiest)

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of each migration file in order:
   - `migrations/20241118000001_create_profiles_table.sql`
   - `migrations/20241118000002_create_items_table.sql`
   - `migrations/20241118000003_add_rbac_support.sql`
4. Paste and run each migration

#### Option B: Using Supabase CLI

```bash
# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### 6. Verify Setup

Run this query in the SQL Editor to verify tables were created:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

You should see:

- profiles
- items

### 7. Test Authentication

1. Start your Next.js app:

```bash
cd nextjs-app
npm run dev
```

2. Navigate to http://localhost:3000
3. Try signing up with a test account
4. Check the Supabase dashboard → Authentication → Users to see your new user
5. Check the SQL Editor to verify a profile was created:

```sql
SELECT * FROM public.profiles;
```

## Database Schema Overview

### Tables

#### `profiles`

Extends `auth.users` with additional user information and RBAC fields.

| Column      | Type        | Description                                       |
| ----------- | ----------- | ------------------------------------------------- |
| id          | UUID        | Primary key, references auth.users                |
| email       | TEXT        | User's email address                              |
| full_name   | TEXT        | User's full name                                  |
| avatar_url  | TEXT        | URL to user's avatar image                        |
| role        | TEXT        | User role (owner, admin, manager, editor, viewer) |
| tenant_id   | TEXT        | Tenant identifier for multi-tenant isolation      |
| permissions | TEXT[]      | Array of specific permissions                     |
| created_at  | TIMESTAMPTZ | Timestamp of profile creation                     |
| updated_at  | TIMESTAMPTZ | Timestamp of last update                          |

#### `items`

Demo table for CRUD operations with user ownership and tenant isolation.

| Column      | Type        | Description                              |
| ----------- | ----------- | ---------------------------------------- |
| id          | UUID        | Primary key                              |
| user_id     | UUID        | Foreign key to auth.users                |
| title       | TEXT        | Item title                               |
| description | TEXT        | Item description                         |
| image_url   | TEXT        | URL to item image                        |
| status      | TEXT        | Item status (active, inactive, archived) |
| tenant_id   | TEXT        | Tenant identifier                        |
| created_at  | TIMESTAMPTZ | Timestamp of creation                    |
| updated_at  | TIMESTAMPTZ | Timestamp of last update                 |

## Role-Based Access Control (RBAC)

### Roles

| Role        | Permissions                            |
| ----------- | -------------------------------------- |
| **owner**   | Full access to all resources in tenant |
| **admin**   | Full access to all resources in tenant |
| **manager** | Can view and manage items, view users  |
| **editor**  | Can create and edit own items          |
| **viewer**  | Can only view items (read-only)        |

### Default Role

New users are assigned the `viewer` role by default. You can change this in the sign-up flow or manually update the role.

### Changing User Roles

To change a user's role, run this SQL query (requires admin access):

```sql
UPDATE public.profiles
SET role = 'editor'
WHERE email = 'user@example.com';
```

## Multi-Tenant Support

### Default Tenant

All users are assigned to the `default` tenant by default.

### Creating New Tenants

To assign users to different tenants:

```sql
-- Update user's tenant
UPDATE public.profiles
SET tenant_id = 'org_acme'
WHERE email = 'user@example.com';
```

### Tenant Isolation

RLS policies ensure users can only access data within their tenant:

- Users can only view items in their tenant
- Users can only view profiles in their tenant (if they have appropriate role)
- Admins can manage all resources in their tenant

## Row Level Security (RLS)

All tables have RLS enabled with policies that enforce:

1. **User Ownership**: Users can manage their own resources
2. **Role-Based Access**: Different permissions based on user role
3. **Tenant Isolation**: Users can only access data in their tenant
4. **Admin Override**: Admins can manage all resources in their tenant

### Testing RLS Policies

You can test RLS policies in the SQL Editor:

```sql
-- Set the user context
SET request.jwt.claims.sub = 'user-uuid-here';

-- Try to query items (should only return user's items)
SELECT * FROM public.items;

-- Reset context
RESET request.jwt.claims.sub;
```

## Helper Functions

The migrations include helper functions for RBAC:

### `has_permission(user_id, permission)`

Check if a user has a specific permission.

```sql
SELECT has_permission('user-uuid', 'items:create');
```

### `get_user_role(user_id)`

Get a user's role.

```sql
SELECT get_user_role('user-uuid');
```

### `get_user_tenant(user_id)`

Get a user's tenant.

```sql
SELECT get_user_tenant('user-uuid');
```

## Generating TypeScript Types

After running migrations, generate TypeScript types:

```bash
# For remote project
supabase gen types typescript --project-id your-project-ref > types/database.types.ts

# For local development
supabase gen types typescript --local > types/database.types.ts
```

The types are already included in the starter kit, but you should regenerate them if you modify the schema.

## Local Development with Supabase

For local development, you can run Supabase locally:

```bash
# Initialize Supabase in your project
supabase init

# Start local Supabase (requires Docker)
supabase start

# This will output local credentials:
# API URL: http://localhost:54321
# Anon key: your-local-anon-key
# Service role key: your-local-service-role-key

# Update .env.local with local credentials
```

## Troubleshooting

### Issue: RLS policies blocking all access

**Solution**: Verify that:

1. User is authenticated (check `auth.uid()`)
2. User has a profile in the profiles table
3. User's role and tenant_id are set correctly

### Issue: Profile not created on signup

**Solution**: Check that:

1. The `handle_new_user()` trigger is installed
2. The trigger is enabled on `auth.users`
3. Check Supabase logs for errors

### Issue: Can't update user role

**Solution**:

1. Use service role key to bypass RLS
2. Or update via SQL Editor in Supabase dashboard
3. Regular users can't change their own role (by design)

### Issue: TypeScript types don't match database

**Solution**: Regenerate types:

```bash
supabase gen types typescript --project-id your-project-ref > types/database.types.ts
```

## Security Best Practices

1. ✅ **Never expose service role key** in client-side code
2. ✅ **Always use anon key** for client-side operations
3. ✅ **Enable RLS** on all tables with user data
4. ✅ **Test RLS policies** thoroughly before production
5. ✅ **Use environment variables** for all credentials
6. ✅ **Rotate keys regularly** in production
7. ✅ **Audit role changes** and log security events
8. ✅ **Implement rate limiting** on auth endpoints

## Next Steps

After setting up Supabase:

1. ✅ Test authentication flow (sign up, sign in, sign out)
2. ✅ Test CRUD operations with items table
3. ✅ Test role-based access control
4. ✅ Test multi-tenant isolation
5. ✅ Set up ImageKit for image uploads (optional)
6. ✅ Configure production environment variables
7. ✅ Deploy to Vercel or your hosting platform

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
