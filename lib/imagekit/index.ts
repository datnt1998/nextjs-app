/**
 * ImageKit Integration Module
 *
 * This module provides utilities for working with ImageKit:
 * - Client configuration for browser-side operations
 * - URL builder with transformation support
 * - LQIP (Low Quality Image Placeholder) generation
 * - File upload utilities with validation
 * - Common image presets
 *
 * @example
 * ```ts
 * import { buildImageUrl, buildLQIP, uploadFile, ImagePresets } from "@/lib/imagekit";
 *
 * // Generate optimized image URL
 * const url = buildImageUrl("/products/shoe.jpg", {
 *   width: 800,
 *   quality: 85,
 *   format: "webp"
 * });
 *
 * // Generate LQIP for progressive loading
 * const placeholder = buildLQIP("/products/shoe.jpg");
 *
 * // Use preset
 * const thumbnail = ImagePresets.thumbnail("/products/shoe.jpg");
 *
 * // Upload file
 * const result = await uploadFile({
 *   file: myFile,
 *   folder: "/products",
 *   tags: ["product"]
 * });
 * ```
 */

export { imagekit } from "./client";
export {
  deleteFile,
  getFileDetails,
  type UploadError,
  type UploadOptions,
  type UploadResponse,
  uploadFile,
  validateFile,
} from "./upload";
export {
  buildImageUrl,
  buildLQIP,
  ImagePresets,
  type ImageTransformations,
} from "./url-builder";
