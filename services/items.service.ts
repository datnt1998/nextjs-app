import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";

type Item = Database["public"]["Tables"]["items"]["Row"];
type ItemInsert = Database["public"]["Tables"]["items"]["Insert"];
type ItemUpdate = Database["public"]["Tables"]["items"]["Update"];
type ItemStatus = Database["public"]["Tables"]["items"]["Row"]["status"];

export interface ItemsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ItemStatus[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ItemsResponse {
  items: Item[];
  total: number;
  page: number;
  limit: number;
}

export const itemsService = {
  async fetchItems(params: ItemsParams = {}): Promise<ItemsResponse> {
    const supabase = createClient();
    const {
      page = 1,
      limit = 10,
      search,
      status,
      sortBy = "created_at",
      sortOrder = "desc",
    } = params;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("items")
      .select("*", { count: "exact" })
      .range(from, to)
      .order(sortBy, { ascending: sortOrder === "asc" });

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Only apply status filter if:
    // 1. Status array exists and has items
    // 2. Not all statuses are selected (optimization: no need to filter if all are selected)
    const allStatuses: ItemStatus[] = ["active", "inactive", "archived"];
    const shouldApplyStatusFilter =
      status && status.length > 0 && status.length < allStatuses.length;

    if (shouldApplyStatusFilter) {
      query = query.in("status", status);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      items: (data as Item[]) || [],
      total: count || 0,
      page,
      limit,
    };
  },

  async fetchItem(id: string): Promise<Item> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Item;
  },

  async createItem(item: ItemInsert): Promise<Item> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("items")
      .insert(item)
      .select()
      .single();

    if (error) throw error;
    return data as Item;
  },

  async updateItem({
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
  },

  async deleteItem(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from("items").delete().eq("id", id);

    if (error) throw error;
  },
};
