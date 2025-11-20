-- =====================================================
-- USER CREATION SCRIPTS
-- =====================================================
-- This file contains ready-to-use scripts for creating users
-- with different roles using the create_user_with_role function
--
-- INSTRUCTIONS:
-- 1. Update the email, password, and name values below
-- 2. Copy and run the desired section in Supabase SQL Editor
-- 3. Users can login immediately (email is auto-confirmed)
-- =====================================================

-- =====================================================
-- 1. CREATE SUPER ADMIN (OWNER)
-- =====================================================
-- Run this first to create your main admin account
-- Owner has ALL permissions

SELECT * FROM create_user_with_role(
  'admin@example.com',           -- Change this email
  'ChangeThisPassword123!',      -- Change this password
  'Super Admin',                 -- Change this name
  'owner'                        -- Role: owner (full access)
);

-- =====================================================
-- 2. CREATE ADMIN USER
-- =====================================================
-- Admin has most permissions except user deletion

SELECT * FROM create_user_with_role(
  'admin.user@example.com',
  'SecurePassword123!',
  'Admin User',
  'admin'
);

-- =====================================================
-- 3. CREATE MANAGER USER
-- =====================================================
-- Manager can manage items and view users/analytics

SELECT * FROM create_user_with_role(
  'manager@example.com',
  'SecurePassword123!',
  'Manager User',
  'manager'
);

-- =====================================================
-- 4. CREATE EDITOR USER
-- =====================================================
-- Editor can create and edit items

SELECT * FROM create_user_with_role(
  'editor@example.com',
  'SecurePassword123!',
  'Editor User',
  'editor'
);

-- =====================================================
-- 5. CREATE VIEWER USER
-- =====================================================
-- Viewer has read-only access

SELECT * FROM create_user_with_role(
  'viewer@example.com',
  'SecurePassword123!',
  'Viewer User',
  'viewer'
);

-- =====================================================
-- 6. CREATE MULTIPLE USERS AT ONCE
-- =====================================================
-- Batch create several users with different roles

DO $$
DECLARE
  user_record RECORD;
  result RECORD;
BEGIN
  -- Edit this array with your users
  FOR user_record IN
    SELECT * FROM (VALUES
      ('owner@example.com', 'pass123', 'Owner User', 'owner'::app_role),
      ('admin@example.com', 'pass123', 'Admin User', 'admin'::app_role),
      ('manager@example.com', 'pass123', 'Manager User', 'manager'::app_role),
      ('editor@example.com', 'pass123', 'Editor User', 'editor'::app_role),
      ('viewer@example.com', 'pass123', 'Viewer User', 'viewer'::app_role)
    ) AS t(email, password, full_name, role)
  LOOP
    -- Create user using the function
    BEGIN
      SELECT * INTO result FROM create_user_with_role(
        user_record.email,
        user_record.password,
        user_record.full_name,
        user_record.role
      );

      RAISE NOTICE 'Created: % (%) with role: %',
        result.email, user_record.password, result.role;
    EXCEPTION
      WHEN OTHERS THEN
        RAISE NOTICE 'Failed to create %: %', user_record.email, SQLERRM;
    END;
  END LOOP;
END $$;

-- =====================================================
-- 7. CREATE USER IN SPECIFIC TENANT
-- =====================================================
-- For multi-tenant applications

SELECT * FROM create_user_with_role(
  'user@tenant-a.com',
  'SecurePassword123!',
  'Tenant A User',
  'manager',
  'tenant-a-uuid'                -- Replace with actual tenant ID
);

-- =====================================================
-- 8. CUSTOM SCRIPT TEMPLATE
-- =====================================================
-- Copy and modify this template for your needs

DO $$
DECLARE
  -- Edit these variables
  v_email TEXT := 'custom@example.com';
  v_password TEXT := 'YourPassword123!';
  v_full_name TEXT := 'Custom User Name';
  v_role app_role := 'editor';  -- Options: owner, admin, manager, editor, viewer
  v_tenant_id TEXT := 'default';

  -- Result variable
  v_result RECORD;
BEGIN
  -- Create the user
  SELECT * INTO v_result FROM create_user_with_role(
    v_email,
    v_password,
    v_full_name,
    v_role,
    v_tenant_id
  );

  -- Display result
  RAISE NOTICE '✅ User created successfully!';
  RAISE NOTICE 'User ID: %', v_result.user_id;
  RAISE NOTICE 'Email: %', v_result.email;
  RAISE NOTICE 'Role: %', v_result.role;
  RAISE NOTICE 'Password: %', v_password;
  RAISE NOTICE '';
  RAISE NOTICE 'You can now login with these credentials.';
END $$;

-- =====================================================
-- 9. VERIFY USER CREATION
-- =====================================================
-- Check if users were created correctly

SELECT
  u.id,
  u.email,
  u.email_confirmed_at as confirmed,
  ur.role,
  p.full_name,
  p.tenant_id,
  u.created_at
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC
LIMIT 10;

-- =====================================================
-- 10. COMMON QUERIES
-- =====================================================

-- Count users by role
SELECT
  ur.role,
  COUNT(*) as user_count
FROM user_roles ur
GROUP BY ur.role
ORDER BY user_count DESC;

-- Find users without roles (should be empty)
SELECT
  u.id,
  u.email,
  u.created_at
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE ur.id IS NULL;

-- List all users with their roles
SELECT
  u.email,
  ur.role,
  p.full_name,
  p.tenant_id
FROM auth.users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN profiles p ON u.id = p.id
ORDER BY ur.role, u.email;

-- =====================================================
-- 11. UPDATE USER ROLE
-- =====================================================
-- Change a user's role after creation

-- Example: Promote user to admin
UPDATE user_roles
SET role = 'admin'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'user@example.com'
);

-- Example: Demote user to viewer
UPDATE user_roles
SET role = 'viewer'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'user@example.com'
);

-- =====================================================
-- 12. DELETE USER
-- =====================================================
-- Completely remove a user (cascade deletes profile and roles)

DELETE FROM auth.users
WHERE email = 'user-to-delete@example.com';

-- Verify deletion
SELECT COUNT(*) as remaining_users FROM auth.users;

-- =====================================================
-- SECURITY NOTES
-- =====================================================
-- 1. Change default passwords immediately after creation
-- 2. Use strong passwords (min 8 chars, mix of letters/numbers/symbols)
-- 3. Store passwords securely (they are hashed in the database)
-- 4. In production, consider requiring email verification
-- 5. Limit owner role to trusted administrators only
-- 6. Regular audit user roles and permissions
-- =====================================================

-- =====================================================
-- QUICK REFERENCE
-- =====================================================
-- Function signature:
-- create_user_with_role(email, password, full_name, [role], [tenant_id])
--
-- Available roles:
-- - owner:   Full access to everything
-- - admin:   Most permissions (can't delete users or manage roles)
-- - manager: Manage items, view users and analytics
-- - editor:  Create and edit items
-- - viewer:  Read-only access
--
-- Default values:
-- - role: 'viewer'
-- - tenant_id: 'default'
-- =====================================================
