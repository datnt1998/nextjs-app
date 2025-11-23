# Items CRUD Setup Guide

This guide will help you set up and verify the Items CRUD module in your Next.js 16 Starter Kit.

## Prerequisites

Before using the Items CRUD module, ensure you have:

1. ✅ Supabase project configured
2. ✅ ImageKit account set up (for image uploads)
3. ✅ Environment variables configured
4. ✅ Database migrations applied

## Step 1: Verify Environment Variables

Check your `.env.local` file contains:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ImageKit (for image uploads)
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your-public-key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id
IMAGEKIT_PRIVATE_KEY=your-private-key
```

## Step 2: Database Setup

The items table should already exist in your Supabase database. Verify by running this query in the Supabase SQL Editor:

```sql
SELECT * FROM items LIMIT 1;
```

If the table doesn't exist, create it:

```sql
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  tenant_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view items in their tenant"
  ON items FOR SELECT
  USING (tenant_id = auth.jwt() -> 'app_metadata' ->> 'tenant_id');

CREATE POLICY "Users can create items in their tenant"
  ON items FOR INSERT
  WITH CHECK (
    tenant_id = auth.jwt() -> 'app_metadata' ->> 'tenant_id'
    AND user_id = auth.uid()
  );

CREATE POLICY "Users can update items in their tenant"
  ON items FOR UPDATE
  USING (tenant_id = auth.jwt() -> 'app_metadata' ->> 'tenant_id');

CREATE POLICY "Users can delete items in their tenant"
  ON items FOR DELETE
  USING (tenant_id = auth.jwt() -> 'app_metadata' ->> 'tenant_id');

-- Create indexes for performance
CREATE INDEX items_user_id_idx ON items(user_id);
CREATE INDEX items_tenant_id_idx ON items(tenant_id);
CREATE INDEX items_status_idx ON items(status);
CREATE INDEX items_created_at_idx ON items(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_items_updated_at
  BEFORE UPDATE ON items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Step 3: Verify Permissions

Ensure your user has the required permissions. Check in Supabase SQL Editor:

```sql
SELECT
  email,
  role,
  permissions
FROM profiles
WHERE id = auth.uid();
```

Required permissions for full access:

- `items:view` - View items
- `items:create` - Create items
- `items:update` - Edit items
- `items:delete` - Delete items

To grant permissions to a user:

```sql
UPDATE profiles
SET permissions = array_append(permissions, 'items:view')
WHERE email = 'user@example.com';

UPDATE profiles
SET permissions = array_append(permissions, 'items:create')
WHERE email = 'user@example.com';

UPDATE profiles
SET permissions = array_append(permissions, 'items:update')
WHERE email = 'user@example.com';

UPDATE profiles
SET permissions = array_append(permissions, 'items:delete')
WHERE email = 'user@example.com';
```

Or grant all at once:

```sql
UPDATE profiles
SET permissions = permissions || ARRAY['items:view', 'items:create', 'items:update', 'items:delete']
WHERE email = 'user@example.com';
```

## Step 4: Start the Development Server

```bash
npm run dev
```

## Step 5: Access the Items Table

1. Navigate to `http://localhost:3000`
2. Sign in with your account
3. Go to Dashboard → Items → Table View
4. Or directly visit: `http://localhost:3000/dashboard/items/table`

## Step 6: Test the Features

### Test Create

1. Click "Create Item" button
2. Fill in the form:
   - Title: "Test Item"
   - Description: "This is a test item"
   - Status: "Active"
   - Upload an image (optional)
3. Click "Create Item"
4. Verify the item appears in the table

### Test Search

1. Type "test" in the search box
2. Verify the table filters to show matching items

### Test Filters

1. Click the "Status" filter button
2. Select "Active"
3. Verify only active items are shown

### Test Sorting

1. Click on the "Title" column header
2. Verify items are sorted alphabetically
3. Click again to reverse the sort

### Test Pagination

1. Create more than 10 items
2. Verify pagination controls appear
3. Navigate between pages

### Test Edit

1. Click the three-dot menu (⋮) on an item
2. Select "Edit Item"
3. Change the title
4. Click "Update Item"
5. Verify the changes are saved

### Test Delete

1. Click the three-dot menu (⋮) on an item
2. Select "Delete Item"
3. Confirm the deletion
4. Verify the item is removed

### Test URL State

1. Apply some filters and search
2. Copy the URL
3. Open the URL in a new tab
4. Verify the filters and search are preserved

## Troubleshooting

### "Authentication required" error

- Ensure you're signed in
- Check your session hasn't expired
- Try signing out and back in

### "Permission denied" error

- Verify your user has the required permissions (see Step 3)
- Check the JWT token contains the correct claims
- Verify RLS policies are configured correctly

### Items not loading

- Check browser console for errors
- Verify Supabase connection in Network tab
- Check RLS policies allow SELECT
- Verify tenant_id is set correctly

### Image upload failing

- Verify ImageKit credentials in `.env.local`
- Check file size (max 5MB)
- Verify file format (JPEG, PNG, WebP only)
- Check `/api/imagekit/auth` endpoint is working

### Table not updating after create/edit/delete

- Check browser console for errors
- Verify TanStack Query is invalidating correctly
- Try refreshing the page manually

## API Testing with cURL

### Create an item

```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "title": "Test Item",
    "description": "Created via API",
    "status": "active"
  }'
```

### Get items list

```bash
curl http://localhost:3000/api/items?page=1&limit=10 \
  -H "Cookie: your-session-cookie"
```

### Update an item

```bash
curl -X PATCH http://localhost:3000/api/items/[item-id] \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "title": "Updated Title"
  }'
```

### Delete an item

```bash
curl -X DELETE http://localhost:3000/api/items/[item-id] \
  -H "Cookie: your-session-cookie"
```

## Performance Tips

1. **Enable caching**: TanStack Query caches automatically
2. **Optimize images**: Use ImageKit transformations
3. **Adjust page size**: Increase if you have fast internet
4. **Use filters**: Narrow down results for faster queries
5. **Index columns**: Ensure database indexes are created

## Next Steps

After verifying the Items CRUD works:

1. Customize the table columns for your needs
2. Add custom filters
3. Implement bulk operations
4. Add export functionality
5. Create additional views (grid, kanban, etc.)

## Support

For issues or questions:

- Check the [Items CRUD README](../components/features/items/README.md)
- Review the code comments
- Check the project documentation
- Open an issue on GitHub

## Files Created

This setup created the following files:

```
app/
├── [locale]/(dashboard)/dashboard/items/table/
│   └── page.tsx                          # Main table page
└── api/items/
    ├── route.ts                          # List and create endpoints
    └── [id]/route.ts                     # Get, update, delete endpoints

components/features/items/
├── items-table-columns.tsx               # Table columns
├── item-form-dialog.tsx                  # Create/edit form
├── item-delete-dialog.tsx                # Delete confirmation
├── index.ts                              # Exports
└── README.md                             # Feature documentation

lib/
├── api/items.ts                          # Client API functions
└── zod/schemas.ts                        # Updated with item schemas

docs/
└── ITEMS_CRUD_SETUP.md                   # This file
```

## Checklist

Use this checklist to verify your setup:

- [ ] Environment variables configured
- [ ] Database table created
- [ ] RLS policies enabled
- [ ] Indexes created
- [ ] User permissions granted
- [ ] Development server running
- [ ] Can access items table page
- [ ] Can create items
- [ ] Can search items
- [ ] Can filter items
- [ ] Can sort items
- [ ] Can edit items
- [ ] Can delete items
- [ ] Can upload images
- [ ] URL state works
- [ ] Pagination works

If all items are checked, your Items CRUD is ready to use! 🎉
