-- Add RBAC (Role-Based Access Control) support to database
-- This migration adds role-based policies, tenant isolation, and permission-based policies

-- Add role and tenant columns to profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'viewer' NOT NULL CHECK (role IN ('owner', 'admin', 'manager', 'editor', 'viewer')),
  ADD COLUMN IF NOT EXISTS tenant_id TEXT DEFAULT 'default' NOT NULL,
  ADD COLUMN IF NOT EXISTS permissions TEXT[] DEFAULT '{}' NOT NULL;

-- Add tenant_id to items table for multi-tenant support
ALTER TABLE public.items
  ADD COLUMN IF NOT EXISTS tenant_id TEXT DEFAULT 'default' NOT NULL;

-- Create index for tenant lookups
CREATE INDEX IF NOT EXISTS profiles_tenant_id_idx ON public.profiles(tenant_id);
CREATE INDEX IF NOT EXISTS items_tenant_id_idx ON public.items(tenant_id);

-- Drop existing policies to replace with RBAC-aware policies
DROP POLICY IF EXISTS "Users can view own items" ON public.items;
DROP POLICY IF EXISTS "Users can insert own items" ON public.items;
DROP POLICY IF EXISTS "Users can update own items" ON public.items;
DROP POLICY IF EXISTS "Users can delete own items" ON public.items;

-- ============================================
-- RBAC Policies for Items Table
-- ============================================

-- Policy: View items in same tenant
CREATE POLICY "View items in tenant"
  ON public.items
  FOR SELECT
  USING (
    -- User must be in the same tenant
    tenant_id = (
      SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- Policy: Insert items (requires items:create permission or appropriate role)
CREATE POLICY "Insert items with permission"
  ON public.items
  FOR INSERT
  WITH CHECK (
    -- User must be authenticated
    auth.uid() IS NOT NULL
    AND
    -- User must be in the same tenant
    tenant_id = (
      SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
    )
    AND
    -- User must have appropriate role
    (
      SELECT role FROM public.profiles WHERE id = auth.uid()
    ) IN ('owner', 'admin', 'manager', 'editor')
  );

-- Policy: Update own items (editors and above)
CREATE POLICY "Update own items"
  ON public.items
  FOR UPDATE
  USING (
    -- User owns the item
    auth.uid() = user_id
    AND
    -- User must be in the same tenant
    tenant_id = (
      SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
    )
    AND
    -- User must have appropriate role
    (
      SELECT role FROM public.profiles WHERE id = auth.uid()
    ) IN ('owner', 'admin', 'manager', 'editor')
  )
  WITH CHECK (
    -- User owns the item
    auth.uid() = user_id
    AND
    -- User must be in the same tenant
    tenant_id = (
      SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- Policy: Admins can update any items in their tenant
CREATE POLICY "Admins can update any items in tenant"
  ON public.items
  FOR UPDATE
  USING (
    -- User must be in the same tenant
    tenant_id = (
      SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
    )
    AND
    -- User must be admin or owner
    (
      SELECT role FROM public.profiles WHERE id = auth.uid()
    ) IN ('owner', 'admin')
  )
  WITH CHECK (
    -- User must be in the same tenant
    tenant_id = (
      SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- Policy: Delete own items (editors and above)
CREATE POLICY "Delete own items"
  ON public.items
  FOR DELETE
  USING (
    -- User owns the item
    auth.uid() = user_id
    AND
    -- User must be in the same tenant
    tenant_id = (
      SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
    )
    AND
    -- User must have appropriate role
    (
      SELECT role FROM public.profiles WHERE id = auth.uid()
    ) IN ('owner', 'admin', 'manager', 'editor')
  );

-- Policy: Admins can delete any items in their tenant
CREATE POLICY "Admins can delete any items in tenant"
  ON public.items
  FOR DELETE
  USING (
    -- User must be in the same tenant
    tenant_id = (
      SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
    )
    AND
    -- User must be admin or owner
    (
      SELECT role FROM public.profiles WHERE id = auth.uid()
    ) IN ('owner', 'admin')
  );

-- ============================================
-- RBAC Policies for Profiles Table
-- ============================================

-- Drop existing profile policies to replace with RBAC-aware policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Policy: Users can view profiles in their tenant
CREATE POLICY "View profiles in tenant"
  ON public.profiles
  FOR SELECT
  USING (
    -- User can view their own profile
    auth.uid() = id
    OR
    -- Or user can view profiles in same tenant if they have appropriate role
    (
      tenant_id = (
        SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
      )
      AND
      (
        SELECT role FROM public.profiles WHERE id = auth.uid()
      ) IN ('owner', 'admin', 'manager')
    )
  );

-- Policy: Users can insert their own profile (during signup)
CREATE POLICY "Insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND
    -- Prevent users from changing their own role or tenant (only admins can do this)
    (
      role = (SELECT role FROM public.profiles WHERE id = auth.uid())
      AND
      tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
    )
  );

-- Policy: Admins can update profiles in their tenant
CREATE POLICY "Admins can update profiles in tenant"
  ON public.profiles
  FOR UPDATE
  USING (
    -- User must be in the same tenant
    tenant_id = (
      SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
    )
    AND
    -- User must be admin or owner
    (
      SELECT role FROM public.profiles WHERE id = auth.uid()
    ) IN ('owner', 'admin')
  )
  WITH CHECK (
    -- User must be in the same tenant
    tenant_id = (
      SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- ============================================
-- Helper Functions for RBAC
-- ============================================

-- Function to check if user has a specific permission
CREATE OR REPLACE FUNCTION public.has_permission(user_id UUID, permission TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
  user_permissions TEXT[];
BEGIN
  SELECT role, permissions INTO user_role, user_permissions
  FROM public.profiles
  WHERE id = user_id;

  -- Owners and admins have all permissions
  IF user_role IN ('owner', 'admin') THEN
    RETURN TRUE;
  END IF;

  -- Check if permission exists in user's permissions array
  RETURN permission = ANY(user_permissions);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT role FROM public.profiles WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's tenant
CREATE OR REPLACE FUNCTION public.get_user_tenant(user_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT tenant_id FROM public.profiles WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the handle_new_user function to include role and tenant
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, tenant_id, permissions)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'viewer'),
    COALESCE(NEW.raw_user_meta_data->>'tenant_id', 'default'),
    COALESCE(
      ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'permissions')),
      '{}'::TEXT[]
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments
COMMENT ON COLUMN public.profiles.role IS 'User role: owner, admin, manager, editor, or viewer';
COMMENT ON COLUMN public.profiles.tenant_id IS 'Tenant identifier for multi-tenant isolation';
COMMENT ON COLUMN public.profiles.permissions IS 'Array of specific permissions granted to the user';
COMMENT ON COLUMN public.items.tenant_id IS 'Tenant identifier for multi-tenant isolation';
COMMENT ON FUNCTION public.has_permission IS 'Check if a user has a specific permission';
COMMENT ON FUNCTION public.get_user_role IS 'Get the role of a user';
COMMENT ON FUNCTION public.get_user_tenant IS 'Get the tenant of a user';
