import { type NextRequest, NextResponse } from "next/server";
import { ApiErrors, handleAPIError } from "@/lib/api";
import {
  createUserProfileFromJWT,
  hasPermission,
  PERMISSIONS,
} from "@/lib/rbac/permissions";
import { createClient } from "@/lib/supabase/server";
import { itemUpdateSchema } from "@/lib/zod/schemas";

/**
 * GET /api/items/[id]
 * Fetch a single item by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw ApiErrors.unauthorized("Authentication required");
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw ApiErrors.unauthorized("Session not found");
    }

    const userProfile = createUserProfileFromJWT(user, session.access_token);

    if (!hasPermission(userProfile, PERMISSIONS.ITEMS_VIEW)) {
      throw ApiErrors.forbidden("You don't have permission to view items");
    }

    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      throw ApiErrors.notFound("Item not found");
    }

    return NextResponse.json(data);
  } catch (error) {
    const errorResponse = handleAPIError(error);
    return NextResponse.json(
      { error: errorResponse.error, code: errorResponse.code },
      { status: errorResponse.statusCode }
    );
  }
}

/**
 * PATCH /api/items/[id]
 * Update an item
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw ApiErrors.unauthorized("Authentication required");
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw ApiErrors.unauthorized("Session not found");
    }

    const userProfile = createUserProfileFromJWT(user, session.access_token);

    if (!hasPermission(userProfile, PERMISSIONS.ITEMS_UPDATE)) {
      throw ApiErrors.forbidden("You don't have permission to update items");
    }

    const body = await request.json();
    const validation = itemUpdateSchema.safeParse(body);

    if (!validation.success) {
      throw ApiErrors.badRequest(
        `Validation failed: ${validation.error.issues.map((e: { message: string }) => e.message).join(", ")}`
      );
    }

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
      { status: errorResponse.statusCode }
    );
  }
}

/**
 * DELETE /api/items/[id]
 * Delete an item
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw ApiErrors.unauthorized("Authentication required");
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw ApiErrors.unauthorized("Session not found");
    }

    const userProfile = createUserProfileFromJWT(user, session.access_token);

    if (!hasPermission(userProfile, PERMISSIONS.ITEMS_DELETE)) {
      throw ApiErrors.forbidden("You don't have permission to delete items");
    }

    const { error } = await supabase.from("items").delete().eq("id", id);

    if (error) {
      console.error("Error deleting item:", error);
      throw ApiErrors.internalServer("Failed to delete item");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const errorResponse = handleAPIError(error);
    return NextResponse.json(
      { error: errorResponse.error, code: errorResponse.code },
      { status: errorResponse.statusCode }
    );
  }
}
