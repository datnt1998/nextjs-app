import { type NextRequest, NextResponse } from "next/server";

/**
 * ImageKit File Delete Endpoint
 *
 * Deletes a file from ImageKit using the server-side API.
 * Requires authentication and uses the private key for secure deletion.
 *
 * @param request - Request body should contain { fileId: string }
 * @returns Success or error response
 */
export async function DELETE(request: NextRequest) {
  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

    if (!privateKey || !urlEndpoint) {
      return NextResponse.json(
        { error: "ImageKit credentials not configured" },
        { status: 500 },
      );
    }

    const body = await request.json();
    const { fileId } = body;

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 },
      );
    }

    // Create basic auth header
    const authHeader = `Basic ${Buffer.from(`${privateKey}:`).toString("base64")}`;

    // Delete file from ImageKit
    const response = await fetch(`https://api.imagekit.io/v1/files/${fileId}`, {
      method: "DELETE",
      headers: {
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Failed to delete file" },
        { status: response.status },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ImageKit delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 },
    );
  }
}
