import { type NextRequest, NextResponse } from "next/server";
import {
  canPerformAction,
  hasPermission,
  PERMISSIONS,
} from "@/lib/rbac/permissions";
import { createClient } from "@/lib/supabase/server";
import { itemUpdateSchema } from "@/lib/zod/schemas";
import type { Database } from "@/types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Item = Database["public"]["Tables"]["items"]["Row"];

/**
 * GET /api/items/[id]
 * Fetch a single item by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile for RBAC
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single<Profile>();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Check permission
    const userProfile = {
      id: profile.id,
      role: profile.role,
      permissions: profile.permissions || [],
      tenant_id: profile.tenant_id || "",
    };

    if (!hasPermission(userProfile, PERMISSIONS.ITEMS_VIEW)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch item
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Item not found" }, { status: 404 });
      }
      console.error("Error fetching item:", error);
      return NextResponse.json(
        { error: "Failed to fetch item" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/items/[id]
 * Update an item by ID
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile for RBAC
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single<Profile>();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Fetch the item to check ownership
    const { data: existingItem, error: fetchError } = await supabase
      .from("items")
      .select("*")
      .eq("id", id)
      .single<Item>();

    if (fetchError || !existingItem) {
      if (fetchError?.code === "PGRST116") {
        return NextResponse.json({ error: "Item not found" }, { status: 404 });
      }
      console.error("Error fetching item:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch item" },
        { status: 500 }
      );
    }

    // Check permission
    const userProfile = {
      id: profile.id,
      role: profile.role,
      permissions: profile.permissions || [],
      tenant_id: profile.tenant_id || "",
    };

    const canUpdate = canPerformAction(
      userProfile,
      PERMISSIONS.ITEMS_UPDATE_ANY,
      existingItem.user_id
    );

    if (!canUpdate) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = itemUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.format(),
        },
        { status: 400 }
      );
    }

    // Update item
    const { data, error } = await supabase
      .from("items")
      .update(validation.data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating item:", error);
      return NextResponse.json(
        { error: "Failed to update item" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/items/[id]
 * Delete an item by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile for RBAC
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single<Profile>();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Fetch the item to check ownership
    const { data: existingItem, error: fetchError } = await supabase
      .from("items")
      .select("*")
      .eq("id", id)
      .single<Item>();

    if (fetchError || !existingItem) {
      if (fetchError?.code === "PGRST116") {
        return NextResponse.json({ error: "Item not found" }, { status: 404 });
      }
      console.error("Error fetching item:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch item" },
        { status: 500 }
      );
    }

    // Check permission
    const userProfile = {
      id: profile.id,
      role: profile.role,
      permissions: profile.permissions || [],
      tenant_id: profile.tenant_id || "",
    };

    const canDelete = canPerformAction(
      userProfile,
      PERMISSIONS.ITEMS_DELETE_ANY,
      existingItem.user_id
    );

    if (!canDelete) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete item
    const { error } = await supabase.from("items").delete().eq("id", id);

    if (error) {
      console.error("Error deleting item:", error);
      return NextResponse.json(
        { error: "Failed to delete item" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
