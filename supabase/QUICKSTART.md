# Database Quick Start Guide

Get your database up and running in 5 minutes.

## Step 1: Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in:
   - **Name**: Your project name
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click "Create new project" and wait ~2 minutes

## Step 2: Get Your Credentials

1. In your Supabase project, go to **Settings** → **API**
2. Copy these values:

```
Project URL: https://xxxxx.supabase.co
anon/public key: eyJhbGc...
service_role key: eyJhbGc... (keep secret!)
```

## Step 3: Configure Environment

Create `.env.local` in the `nextjs-app` directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

## Step 4: Run Migrations

### Option A: Supabase Dashboard (Easiest)

1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New query"
3. Copy and paste the contents of each file in order:
   - `migrations/20241118000001_create_profiles_table.sql`
   - `migrations/20241118000002_create_items_table.sql`
   - `migrations/20241118000003_add_rbac_support.sql`
4. Click "Run" for each migration

### Option B: Supabase CLI

```bash
# Install CLI
npm install -g supabase

# Link to your project
supabase link --project-ref xxxxx

# Push migrations
supabase db push
```

## Step 5: Verify Setup

Run this query in SQL Editor:

```sql
-- Check tables were created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';

-- Should show: profiles, items
```

## Step 6: Test It Out

1. Start your Next.js app:

```bash
cd nextjs-app
npm run dev
```

2. Open http://localhost:3000

3. Sign up with a test account

4. Check SQL Editor to see your profile:

```sql
SELECT * FROM public.profiles;
```

## Done! 🎉

Your database is ready with:

- ✅ User profiles with RBAC
- ✅ Items table for CRUD operations
- ✅ Row Level Security enabled
- ✅ Multi-tenant support
- ✅ Automatic profile creation on signup

## Next Steps

- Read [`SETUP.md`](./SETUP.md) for detailed documentation
- Check [`common-queries.sql`](./common-queries.sql) for useful queries
- Review [`migrations/README.md`](./migrations/README.md) for migration details

## Troubleshooting

### "relation does not exist" error

- Make sure you ran all 3 migrations in order
- Check SQL Editor for any error messages

### User can't see data

- Verify RLS is enabled: `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';`
- Check user has a profile: `SELECT * FROM public.profiles WHERE email = 'user@example.com';`

### Profile not created on signup

- Check the trigger exists: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`
- Check Supabase logs for errors

## Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- Check the detailed [`SETUP.md`](./SETUP.md) guide
