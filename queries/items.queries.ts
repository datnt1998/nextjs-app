"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { itemsKeys } from "@/lib/query-keys";
import { type ItemsParams, itemsService } from "@/services/items.service";
import type { Database } from "@/types/database.types";

type Item = Database["public"]["Tables"]["items"]["Row"];
type ItemInsert = Database["public"]["Tables"]["items"]["Insert"];
type ItemUpdate = Database["public"]["Tables"]["items"]["Update"];

// Hook: useItems - Fetch items list
export function useItems(params: ItemsParams = {}) {
  return useQuery({
    queryKey: itemsKeys.list(params),
    queryFn: () => itemsService.fetchItems(params),
  });
}

// Hook: useItem - Fetch single item
export function useItem(id: string) {
  return useQuery({
    queryKey: itemsKeys.detail(id),
    queryFn: () => itemsService.fetchItem(id),
    enabled: !!id,
  });
}

// Hook: useCreateItem - Create item mutation
export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: ItemInsert) => itemsService.createItem(item),
    onSuccess: () => {
      // Invalidate items list queries
      queryClient.invalidateQueries({ queryKey: itemsKeys.root });
    },
  });
}

// Hook: useUpdateItem - Update item mutation
export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ItemUpdate & { id: string }) =>
      itemsService.updateItem(data),
    onSuccess: (data: Item) => {
      // Invalidate specific item and list queries
      queryClient.invalidateQueries({ queryKey: itemsKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: itemsKeys.root });
    },
  });
}

// Hook: useDeleteItem - Delete item mutation
export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => itemsService.deleteItem(id),
    onSuccess: () => {
      // Invalidate items list queries
      queryClient.invalidateQueries({ queryKey: itemsKeys.root });
    },
  });
}
