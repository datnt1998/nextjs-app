"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { itemsKeys } from "@/lib/query-keys";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";

type Item = Database["public"]["Tables"]["items"]["Row"];
type ItemInsert = Database["public"]["Tables"]["items"]["Insert"];
type ItemUpdate = Database["public"]["Tables"]["items"]["Update"];

interface ItemsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string[];
}

// Fetch items list
async function fetchItems(params: ItemsParams = {}) {
  const supabase = createClient();
  const { page = 1, limit = 10, search, status } = params;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("items")
    .select("*", { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (status && status.length > 0) {
    query = query.in("status", status);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    items: data || [],
    total: count || 0,
    page,
    limit,
  };
}

// Fetch single item
async function fetchItem(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

// Create item
async function createItem(item: ItemInsert) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("items")
    .insert(item)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update item
async function updateItem({
  id,
  ...updates
}: ItemUpdate & { id: string }): Promise<Item> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("items")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Item;
}

// Delete item
async function deleteItem(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("items").delete().eq("id", id);

  if (error) throw error;
}

// Hook: useItems - Fetch items list
export function useItems(params: ItemsParams = {}) {
  return useQuery({
    queryKey: itemsKeys.list(params),
    queryFn: () => fetchItems(params),
  });
}

// Hook: useItem - Fetch single item
export function useItem(id: string) {
  return useQuery({
    queryKey: itemsKeys.detail(id),
    queryFn: () => fetchItem(id),
    enabled: !!id,
  });
}

// Hook: useCreateItem - Create item mutation
export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createItem,
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
    mutationFn: updateItem,
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
    mutationFn: deleteItem,
    onSuccess: () => {
      // Invalidate items list queries
      queryClient.invalidateQueries({ queryKey: itemsKeys.root });
    },
  });
}
