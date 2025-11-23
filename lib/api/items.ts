import type { ItemInput, ItemUpdateInput } from "@/lib/zod/schemas";
import type { Database } from "@/types/database.types";

export type Item = Database["public"]["Tables"]["items"]["Row"];

export interface ItemsListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ItemsListResponse {
  items: Item[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Fetch items list with pagination and filters
 */
export async function fetchItems(
  params: ItemsListParams = {}
): Promise<ItemsListResponse> {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.search) searchParams.set("search", params.search);
  if (params.status?.length)
    searchParams.set("status", params.status.join(","));
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

  const response = await fetch(`/api/items?${searchParams.toString()}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch items");
  }

  return response.json();
}

/**
 * Fetch a single item by ID
 */
export async function fetchItem(id: string): Promise<Item> {
  const response = await fetch(`/api/items/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch item");
  }

  return response.json();
}

/**
 * Create a new item
 */
export async function createItem(data: ItemInput): Promise<Item> {
  const response = await fetch("/api/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create item");
  }

  return response.json();
}

/**
 * Update an existing item
 */
export async function updateItem(
  id: string,
  data: ItemUpdateInput
): Promise<Item> {
  const response = await fetch(`/api/items/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update item");
  }

  return response.json();
}

/**
 * Delete an item
 */
export async function deleteItem(id: string): Promise<void> {
  const response = await fetch(`/api/items/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete item");
  }
}
