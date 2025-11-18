import { type NextRequest, NextResponse } from "next/server";

/**
 * ImageKit File Details Endpoint
 *
 * Retrieves file details from ImageKit using the server-side API.
 * Requires authentication and uses the private key for secure access.
 *
 * @param request - Request object
 * @param params - Route parameters containing fileId
 * @returns File details or error response
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

    if (!privateKey) {
      return NextResponse.json(
        { error: "ImageKit credentials not configured" },
        { status: 500 }
      );
    }

    const { fileId } = await params;

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    // Create basic auth header
    const authHeader = `Basic ${Buffer.from(`${privateKey}:`).toString("base64")}`;

    // Get file details from ImageKit
    const response = await fetch(
      `https://api.imagekit.io/v1/files/${fileId}/details`,
      {
        method: "GET",
        headers: {
          Authorization: authHeader,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Failed to get file details" },
        { status: response.status }
      );
    }

    const fileDetails = await response.json();
    return NextResponse.json(fileDetails);
  } catch (error) {
    console.error("ImageKit file details error:", error);
    return NextResponse.json(
      { error: "Failed to get file details" },
      { status: 500 }
    );
  }
}
