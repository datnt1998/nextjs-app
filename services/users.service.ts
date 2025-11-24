import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export interface UsersParams {
  page?: number;
  limit?: number;
  role?: string;
}

export interface UsersResponse {
  users: Profile[];
  total: number;
  page: number;
  limit: number;
}

export const usersService = {
  async fetchUsers(params: UsersParams = {}): Promise<UsersResponse> {
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
      users: (data as Profile[]) || [],
      total: count || 0,
      page,
      limit,
    };
  },

  async fetchUser(id: string): Promise<Profile> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Profile;
  },

  async fetchProfile(): Promise<Profile> {
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
    return data as Profile;
  },

  async updateProfile({
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
  },
};
