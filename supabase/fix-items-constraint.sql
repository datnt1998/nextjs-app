-- Fix Items Table Status Constraint
-- Run this in your Supabase SQL Editor

-- First, let's check the current constraint
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'items'::regclass
  AND conname = 'items_status_check';

-- Drop the existing constraint if it exists
ALTER TABLE items DROP CONSTRAINT IF EXISTS items_status_check;

-- Add the correct constraint with lowercase values
ALTER TABLE items 
ADD CONSTRAINT items_status_check 
CHECK (status IN ('active', 'inactive', 'archived'));

-- Verify the constraint was added
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'items'::regclass
  AND conname = 'items_status_check';

-- Test by inserting a sample row (replace with your actual user_id and tenant_id)
-- INSERT INTO items (user_id, title, status, tenant_id)
-- VALUES (
--   'your-user-id',
--   'Test Item',
--   'active',
--   'your-tenant-id'
-- );
