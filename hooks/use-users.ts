"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersKeys } from "@/lib/query-keys";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

interface UsersParams {
  page?: number;
  limit?: number;
  role?: string;
}

// Fetch users list
async function fetchUsers(params: UsersParams = {}) {
  const supabase = createClient();
  const { page = 1, limit = 10, role } = params;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const query = supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: false });

  // Note: Role filtering would require additional metadata in profiles table
  // This is a placeholder for when role field is added
  if (role) {
    // query = query.eq("role", role);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    users: data || [],
    total: count || 0,
    page,
    limit,
  };
}

// Fetch single user
async function fetchUser(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

// Fetch current user profile
async function fetchProfile() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) throw error;
  return data;
}

// Update profile
async function updateProfile({
  id,
  ...updates
}: ProfileUpdate & { id: string }): Promise<Profile> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

// Hook: useUsers - Fetch users list
export function useUsers(params: UsersParams = {}) {
  return useQuery({
    queryKey: usersKeys.list(params),
    queryFn: () => fetchUsers(params),
  });
}

// Hook: useUser - Fetch single user
export function useUser(id: string) {
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: () => fetchUser(id),
    enabled: !!id,
  });
}

// Hook: useProfile - Fetch current user profile
export function useProfile() {
  return useQuery({
    queryKey: usersKeys.profile(),
    queryFn: fetchProfile,
  });
}

// Hook: useUpdateProfile - Update profile mutation
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data: Profile) => {
      // Invalidate profile and specific user queries
      queryClient.invalidateQueries({ queryKey: usersKeys.profile() });
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: usersKeys.root });
    },
  });
}
