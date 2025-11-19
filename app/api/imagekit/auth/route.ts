import crypto from "crypto";
import { NextResponse } from "next/server";

/**
 * ImageKit Authentication Endpoint
 *
 * Generates authentication parameters required for client-side uploads to ImageKit.
 * This endpoint must be called before uploading files to get the signature, token, and expire time.
 *
 * @returns Authentication parameters (signature, token, expire, publicKey)
 *
 * Security: This endpoint generates server-side signatures to ensure secure uploads.
 * The private key never leaves the server.
 */
export async function GET() {
  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;

    if (!privateKey || !publicKey) {
      return NextResponse.json(
        { error: "ImageKit credentials not configured" },
        { status: 500 },
      );
    }

    // Generate authentication parameters
    const token = crypto.randomUUID();
    const expire = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

    // Create signature
    const signature = crypto
      .createHmac("sha1", privateKey)
      .update(token + expire)
      .digest("hex");

    return NextResponse.json({
      token,
      expire,
      signature,
      publicKey,
    });
  } catch (error) {
    console.error("ImageKit auth error:", error);
    return NextResponse.json(
      { error: "Failed to generate authentication parameters" },
      { status: 500 },
    );
  }
}
