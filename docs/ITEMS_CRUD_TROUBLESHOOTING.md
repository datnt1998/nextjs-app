# Items CRUD Troubleshooting Guide

## Error: "new row for relation 'items' violates check constraint 'items_status_check'"

This error occurs when the database check constraint doesn't match the values being sent from the form.

### Quick Fix

Run this SQL in your Supabase SQL Editor:

```sql
-- Drop the existing constraint
ALTER TABLE items DROP CONSTRAINT IF EXISTS items_status_check;

-- Add the correct constraint with lowercase values
ALTER TABLE items
ADD CONSTRAINT items_status_check
CHECK (status IN ('active', 'inactive', 'archived'));
```

### Root Cause

The database check constraint might be:

1. Case-sensitive and expecting different casing
2. Checking for different values than what the form sends
3. Missing or incorrectly defined

### Verification Steps

1. **Check the current constraint:**

```sql
SELECT
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'items'::regclass
  AND conname = 'items_status_check';
```

2. **Check what values are being sent:**
   - Open browser DevTools → Network tab
   - Create an item
   - Look at the POST request to `/api/items`
   - Check the request payload

3. **Check server logs:**
   - Look at your terminal where `npm run dev` is running
   - You should see: `Inserting item with data: {...}`
   - Verify the `status` field value

### Expected Values

The form sends these lowercase values:

- `"active"`
- `"inactive"`
- `"archived"`

The database constraint must accept these exact values (case-sensitive).

### Alternative: Update Database Schema

If you prefer different values, update both the constraint AND the form:

**Database:**

```sql
ALTER TABLE items DROP CONSTRAINT IF EXISTS items_status_check;
ALTER TABLE items
ADD CONSTRAINT items_status_check
CHECK (status IN ('Active', 'Inactive', 'Archived'));
```

**Form** (`item-form-dialog.tsx`):

```tsx
<SelectItem value="Active">{t("statusActive")}</SelectItem>
<SelectItem value="Inactive">{t("statusInactive")}</SelectItem>
<SelectItem value="Archived">{t("statusArchived")}</SelectItem>
```

**Schema** (`lib/zod/schemas.ts`):

```ts
status: z.enum(["Active", "Inactive", "Archived"]),
```

**Database Types** (`types/database.types.ts`):

```ts
status: "Active" | "Inactive" | "Archived";
```

### Complete Database Setup

If your items table doesn't exist or needs to be recreated:

```sql
-- Drop existing table (WARNING: This deletes all data!)
DROP TABLE IF EXISTS items CASCADE;

-- Create items table
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  tenant_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Add check constraint with lowercase values
  CONSTRAINT items_status_check CHECK (status IN ('active', 'inactive', 'archived'))
);

-- Enable Row Level Security
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view items in their tenant"
  ON items FOR SELECT
  USING (tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Users can create items in their tenant"
  ON items FOR INSERT
  WITH CHECK (
    tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid
    AND user_id = auth.uid()
  );

CREATE POLICY "Users can update items in their tenant"
  ON items FOR UPDATE
  USING (tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid);

CREATE POLICY "Users can delete items in their tenant"
  ON items FOR DELETE
  USING (tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid);

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

### Test the Fix

After applying the SQL fix, test by creating an item:

1. Go to `/dashboard/items/table`
2. Click "Create Item"
3. Fill in:
   - Title: "Test Item"
   - Status: "Active"
4. Click "Create Item"

If successful, the item should appear in the table.

### Still Having Issues?

1. **Check browser console** for JavaScript errors
2. **Check server logs** for the exact data being sent
3. **Verify Supabase connection** in the Network tab
4. **Check RLS policies** aren't blocking the insert
5. **Verify tenant_id** is being set correctly

### Debug Checklist

- [ ] Database constraint uses lowercase values
- [ ] Form sends lowercase values
- [ ] Zod schema validates lowercase values
- [ ] TypeScript types match lowercase values
- [ ] No JavaScript errors in console
- [ ] Server logs show correct data
- [ ] RLS policies allow INSERT
- [ ] User has `items:create` permission
- [ ] tenant_id is set correctly

### Get More Help

If the issue persists:

1. Check the server logs for the exact error
2. Copy the full error message
3. Check what data is being sent in the Network tab
4. Verify the database constraint definition
5. Open an issue with:
   - Full error message
   - Request payload from Network tab
   - Database constraint definition
   - Server logs

## Other Common Errors

### "Authentication required"

**Solution:** Sign in or refresh your session

### "Permission denied"

**Solution:** Grant `items:create` permission:

```sql
UPDATE profiles
SET permissions = array_append(permissions, 'items:create')
WHERE email = 'your-email@example.com';
```

### "Failed to upload image"

**Solution:** Check ImageKit credentials in `.env.local`

### "tenant_id cannot be null"

**Solution:** Ensure your JWT contains tenant_id in app_metadata

### Items not loading

**Solution:** Check RLS policies and `items:view` permission

## Prevention

To avoid this issue in the future:

1. Always define check constraints when creating tables
2. Document expected values in comments
3. Keep database types in sync with TypeScript types
4. Use migrations for schema changes
5. Test with actual data before deploying

## Related Files

- Database constraint: Supabase SQL Editor
- Form values: `components/features/items/item-form-dialog.tsx`
- Validation schema: `lib/zod/schemas.ts`
- Database types: `types/database.types.ts`
- API endpoint: `app/api/items/route.ts`
