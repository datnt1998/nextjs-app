-- Common SQL Queries for NextJS Starter Kit
-- Use these queries in Supabase SQL Editor for common administrative tasks

-- ============================================
-- USER MANAGEMENT
-- ============================================

-- View all users with their profiles
SELECT 
  u.id,
  u.email,
  u.created_at as user_created_at,
  p.full_name,
  p.role,
  p.tenant_id,
  p.permissions
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- Change user role
UPDATE public.profiles
SET role = 'editor'  -- Change to: owner, admin, manager, editor, viewer
WHERE email = 'user@example.com';

-- Change user tenant
UPDATE public.profiles
SET tenant_id = 'org_acme'
WHERE email = 'user@example.com';

-- Add specific permissions to a user
UPDATE public.profiles
SET permissions = array_append(permissions, 'items:delete')
WHERE email = 'user@example.com';

-- Remove specific permission from a user
UPDATE public.profiles
SET permissions = array_remove(permissions, 'items:delete')
WHERE email = 'user@example.com';

-- Set multiple permissions for a user
UPDATE public.profiles
SET permissions = ARRAY['items:read', 'items:create', 'items:update']
WHERE email = 'user@example.com';

-- ============================================
-- TENANT MANAGEMENT
-- ============================================

-- View all tenants and user counts
SELECT 
  tenant_id,
  COUNT(*) as user_count,
  array_agg(DISTINCT role) as roles_in_tenant
FROM public.profiles
GROUP BY tenant_id
ORDER BY user_count DESC;

-- Move user and their items to a new tenant
BEGIN;
  UPDATE public.profiles
  SET tenant_id = 'org_new'
  WHERE id = 'user-uuid-here';
  
  UPDATE public.items
  SET tenant_id = 'org_new'
  WHERE user_id = 'user-uuid-here';
COMMIT;

-- View all items in a tenant
SELECT 
  i.*,
  p.email as owner_email,
  p.full_name as owner_name
FROM public.items i
JOIN public.profiles p ON i.user_id = p.id
WHERE i.tenant_id = 'default'
ORDER BY i.created_at DESC;

-- ============================================
-- ROLE MANAGEMENT
-- ============================================

-- View users by role
SELECT 
  role,
  COUNT(*) as user_count,
  array_agg(email) as users
FROM public.profiles
GROUP BY role
ORDER BY user_count DESC;

-- Promote user to admin
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'user@example.com';

-- Demote user to viewer
UPDATE public.profiles
SET role = 'viewer'
WHERE email = 'user@example.com';

-- Bulk update: Make all editors in a tenant managers
UPDATE public.profiles
SET role = 'manager'
WHERE tenant_id = 'org_acme' AND role = 'editor';

-- ============================================
-- ITEMS MANAGEMENT
-- ============================================

-- View all items with owner information
SELECT 
  i.id,
  i.title,
  i.status,
  i.tenant_id,
  i.created_at,
  p.email as owner_email,
  p.full_name as owner_name,
  p.role as owner_role
FROM public.items i
JOIN public.profiles p ON i.user_id = p.id
ORDER BY i.created_at DESC;

-- View items by status
SELECT 
  status,
  COUNT(*) as count
FROM public.items
GROUP BY status;

-- Archive old inactive items (older than 90 days)
UPDATE public.items
SET status = 'archived'
WHERE status = 'inactive' 
  AND updated_at < NOW() - INTERVAL '90 days';

-- Delete items from a specific user
DELETE FROM public.items
WHERE user_id = 'user-uuid-here';

-- Transfer items from one user to another (within same tenant)
UPDATE public.items
SET user_id = 'new-user-uuid'
WHERE user_id = 'old-user-uuid'
  AND tenant_id = (
    SELECT tenant_id FROM public.profiles WHERE id = 'new-user-uuid'
  );

-- ============================================
-- TESTING RLS POLICIES
-- ============================================

-- Test as a specific user (viewer role)
SET request.jwt.claims.sub = 'user-uuid-here';
SELECT * FROM public.items;  -- Should only see items in user's tenant
RESET request.jwt.claims.sub;

-- Test as admin
SET request.jwt.claims.sub = 'admin-user-uuid';
SELECT * FROM public.items;  -- Should see all items in admin's tenant
RESET request.jwt.claims.sub;

-- Test permission function
SELECT has_permission('user-uuid-here', 'items:create');

-- Test role function
SELECT get_user_role('user-uuid-here');

-- Test tenant function
SELECT get_user_tenant('user-uuid-here');

-- ============================================
-- AUDIT AND MONITORING
-- ============================================

-- View recent user signups
SELECT 
  u.id,
  u.email,
  u.created_at,
  p.role,
  p.tenant_id
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.created_at > NOW() - INTERVAL '7 days'
ORDER BY u.created_at DESC;

-- View users without profiles (should be empty if trigger is working)
SELECT 
  u.id,
  u.email,
  u.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- View items created in the last 24 hours
SELECT 
  i.*,
  p.email as owner_email
FROM public.items i
JOIN public.profiles p ON i.user_id = p.id
WHERE i.created_at > NOW() - INTERVAL '24 hours'
ORDER BY i.created_at DESC;

-- Count items by user
SELECT 
  p.email,
  p.full_name,
  p.role,
  COUNT(i.id) as item_count
FROM public.profiles p
LEFT JOIN public.items i ON p.id = i.user_id
GROUP BY p.id, p.email, p.full_name, p.role
ORDER BY item_count DESC;

-- ============================================
-- MAINTENANCE
-- ============================================

-- View table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- View RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check if RLS is enabled on tables
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- View indexes
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- ============================================
-- CLEANUP (USE WITH CAUTION)
-- ============================================

-- Delete all items (keeps users)
-- TRUNCATE public.items CASCADE;

-- Delete all profiles and items (keeps auth.users)
-- TRUNCATE public.profiles, public.items CASCADE;

-- Reset auto-increment sequences
-- ALTER SEQUENCE IF EXISTS items_id_seq RESTART WITH 1;

-- ============================================
-- BACKUP QUERIES
-- ============================================

-- Export users to JSON (copy result for backup)
SELECT json_agg(row_to_json(t))
FROM (
  SELECT 
    u.id,
    u.email,
    p.full_name,
    p.role,
    p.tenant_id,
    p.permissions
  FROM auth.users u
  JOIN public.profiles p ON u.id = p.id
) t;

-- Export items to JSON (copy result for backup)
SELECT json_agg(row_to_json(t))
FROM (
  SELECT * FROM public.items
) t;
