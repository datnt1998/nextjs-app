import { type NextRequest, NextResponse } from "next/server";
import { ApiErrors, handleAPIError } from "@/lib/api";
import {
  canPerformAction,
  createUserProfileFromJWT,
  hasPermission,
  PERMISSIONS,
} from "@/lib/rbac/permissions";
import { createClient } from "@/lib/supabase/server";
import { itemUpdateSchema } from "@/lib/zod/schemas";
import type { Database } from "@/types/database.types";

type Item = Database["public"]["Tables"]["items"]["Row"];

/**
 * GET /api/items/[id]
 * Fetch a single item by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Get authenticated user and session (for JWT)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw ApiErrors.unauthorized("Authentication required");
    }

    // Get session to access JWT access token
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw ApiErrors.unauthorized("Session not found");
    }

    // Create user profile from JWT (no database query needed!)
    const userProfile = createUserProfileFromJWT(user, session.access_token);

    // Check permission
    if (!hasPermission(userProfile, PERMISSIONS.ITEMS_VIEW)) {
      throw ApiErrors.forbidden("You don't have permission to view items");
    }

    // Fetch item
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw ApiErrors.notFound("Item not found");
      }
      console.error("Error fetching item:", error);
      throw ApiErrors.internalServer("Failed to fetch item");
    }

    return NextResponse.json(data);
  } catch (error) {
    const errorResponse = handleAPIError(error);
    return NextResponse.json(
      { error: errorResponse.error, code: errorResponse.code },
      { status: errorResponse.statusCode },
    );
  }
}

/**
 * PATCH /api/items/[id]
 * Update an item by ID
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Get authenticated user and session (for JWT)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw ApiErrors.unauthorized("Authentication required");
    }

    // Get session to access JWT access token
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw ApiErrors.unauthorized("Session not found");
    }

    // Create user profile from JWT (no database query needed!)
    const userProfile = createUserProfileFromJWT(user, session.access_token);

    // Fetch the item to check ownership
    const { data: existingItem, error: fetchError } = await supabase
      .from("items")
      .select("*")
      .eq("id", id)
      .single<Item>();

    if (fetchError || !existingItem) {
      if (fetchError?.code === "PGRST116") {
        throw ApiErrors.notFound("Item not found");
      }
      console.error("Error fetching item:", fetchError);
      throw ApiErrors.internalServer("Failed to fetch item");
    }

    // Check permission (can update any item OR can update own item)
    const canUpdate = canPerformAction(
      userProfile,
      PERMISSIONS.ITEMS_UPDATE_ANY,
      existingItem.user_id,
    );

    if (!canUpdate) {
      throw ApiErrors.forbidden(
        "You don't have permission to update this item",
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = itemUpdateSchema.safeParse(body);

    if (!validation.success) {
      throw ApiErrors.badRequest(
        `Validation failed: ${validation.error.issues.map((e: { message: string }) => e.message).join(", ")}`,
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
      throw ApiErrors.internalServer("Failed to update item");
    }

    return NextResponse.json(data);
  } catch (error) {
    const errorResponse = handleAPIError(error);
    return NextResponse.json(
      { error: errorResponse.error, code: errorResponse.code },
      { status: errorResponse.statusCode },
    );
  }
}

/**
 * DELETE /api/items/[id]
 * Delete an item by ID
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Get authenticated user and session (for JWT)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw ApiErrors.unauthorized("Authentication required");
    }

    // Get session to access JWT access token
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw ApiErrors.unauthorized("Session not found");
    }

    // Create user profile from JWT (no database query needed!)
    const userProfile = createUserProfileFromJWT(user, session.access_token);

    // Fetch the item to check ownership
    const { data: existingItem, error: fetchError } = await supabase
      .from("items")
      .select("*")
      .eq("id", id)
      .single<Item>();

    if (fetchError || !existingItem) {
      if (fetchError?.code === "PGRST116") {
        throw ApiErrors.notFound("Item not found");
      }
      console.error("Error fetching item:", fetchError);
      throw ApiErrors.internalServer("Failed to fetch item");
    }

    // Check permission (can delete any item OR can delete own item)
    const canDelete = canPerformAction(
      userProfile,
      PERMISSIONS.ITEMS_DELETE_ANY,
      existingItem.user_id,
    );

    if (!canDelete) {
      throw ApiErrors.forbidden(
        "You don't have permission to delete this item",
      );
    }

    // Delete item
    const { error } = await supabase.from("items").delete().eq("id", id);

    if (error) {
      console.error("Error deleting item:", error);
      throw ApiErrors.internalServer("Failed to delete item");
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const errorResponse = handleAPIError(error);
    return NextResponse.json(
      { error: errorResponse.error, code: errorResponse.code },
      { status: errorResponse.statusCode },
    );
  }
}
