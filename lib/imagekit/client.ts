import ImageKit from "imagekit-javascript";

/**
 * ImageKit client instance for browser-side operations
 * Used for URL generation and client-side transformations
 */
export const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});
