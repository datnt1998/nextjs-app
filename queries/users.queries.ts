"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersKeys } from "@/lib/query-keys";
import { type UsersParams, usersService } from "@/services/users.service";
import type { Database } from "@/types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

// Hook: useUsers - Fetch users list
export function useUsers(params: UsersParams = {}) {
  return useQuery({
    queryKey: usersKeys.list(params),
    queryFn: () => usersService.fetchUsers(params),
  });
}

// Hook: useUser - Fetch single user
export function useUser(id: string) {
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: () => usersService.fetchUser(id),
    enabled: !!id,
  });
}

// Hook: useProfile - Fetch current user profile
export function useProfile() {
  return useQuery({
    queryKey: usersKeys.profile(),
    queryFn: () => usersService.fetchProfile(),
  });
}

// Hook: useUpdateProfile - Update profile mutation
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProfileUpdate & { id: string }) =>
      usersService.updateProfile(data),
    onSuccess: (data: Profile) => {
      // Invalidate profile and specific user queries
      queryClient.invalidateQueries({ queryKey: usersKeys.profile() });
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: usersKeys.root });
    },
  });
}
