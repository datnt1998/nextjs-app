import { type NextRequest, NextResponse } from "next/server";
import { ApiErrors, handleAPIError } from "@/lib/api";
import {
  createUserProfileFromJWT,
  hasPermission,
  PERMISSIONS,
} from "@/lib/rbac/permissions";
import { createClient } from "@/lib/supabase/server";
import { itemCreateSchema } from "@/lib/zod/schemas";

/**
 * GET /api/items
 * Fetch items list with pagination, search, and filter
 */
export async function GET(request: NextRequest) {
  try {
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

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";
    const statusParam = searchParams.get("status") || "";
    const status = statusParam
      ? (statusParam.split(",") as Array<"active" | "inactive" | "archived">)
      : [];
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Calculate pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Build query
    let query = supabase
      .from("items")
      .select("*", { count: "exact" })
      .range(from, to)
      .order(sortBy, { ascending: sortOrder === "asc" });

    // Apply search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply status filter
    if (status.length > 0) {
      query = query.in("status", status);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching items:", error);
      throw ApiErrors.internalServer("Failed to fetch items");
    }

    return NextResponse.json({
      items: data || [],
      total: count || 0,
      page,
      limit,
    });
  } catch (error) {
    const errorResponse = handleAPIError(error);
    return NextResponse.json(
      { error: errorResponse.error, code: errorResponse.code },
      { status: errorResponse.statusCode }
    );
  }
}

/**
 * POST /api/items
 * Create a new item
 */
export async function POST(request: NextRequest) {
  try {
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
    if (!hasPermission(userProfile, PERMISSIONS.ITEMS_CREATE)) {
      throw ApiErrors.forbidden("You don't have permission to create items");
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = itemCreateSchema.safeParse(body);

    if (!validation.success) {
      throw ApiErrors.badRequest(
        `Validation failed: ${validation.error.issues.map((e: { message: string }) => e.message).join(", ")}`
      );
    }

    // Prepare data for insertion
    const insertData = {
      ...validation.data,
      user_id: user.id,
    };

    // Debug log
    console.log(
      "Inserting item with data:",
      JSON.stringify(insertData, null, 2)
    );

    // Create item
    const { data, error } = await supabase
      .from("items")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Error creating item:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      throw ApiErrors.internalServer("Failed to create item");
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    const errorResponse = handleAPIError(error);
    return NextResponse.json(
      { error: errorResponse.error, code: errorResponse.code },
      { status: errorResponse.statusCode }
    );
  }
}
