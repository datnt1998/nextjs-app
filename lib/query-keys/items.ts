export const itemsKeys = {
  root: ["items"] as const,
  list: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string[];
  }) => [...itemsKeys.root, "list", params] as const,
  detail: (id: string) => [...itemsKeys.root, "detail", id] as const,
};
