export const usersKeys = {
  root: ["users"] as const,
  list: (params?: { page?: number; limit?: number; role?: string }) =>
    [...usersKeys.root, "list", params] as const,
  detail: (id: string) => [...usersKeys.root, "detail", id] as const,
  profile: () => [...usersKeys.root, "profile"] as const,
};
