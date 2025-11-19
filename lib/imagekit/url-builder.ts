import { imagekit } from "./client";

/**
 * Transformation options for ImageKit URL builder
 */
export interface ImageTransformations {
  width?: number;
  height?: number;
  quality?: number;
  format?: "auto" | "webp" | "jpg" | "png" | "avif";
  blur?: number;
  aspectRatio?: string;
  crop?: "maintain_ratio" | "force" | "at_least" | "at_max";
  cropMode?: "extract" | "pad_extract" | "pad_resize";
  focus?: "auto" | "face" | "center";
  dpr?: number;
}

/**
 * Build an optimized ImageKit URL with transformations
 *
 * @param path - The path to the image in ImageKit (e.g., "/products/image.jpg")
 * @param transformations - Optional transformation parameters
 * @returns The transformed image URL
 *
 * @example
 * ```ts
 * // Basic usage
 * const url = buildImageUrl("/products/shoe.jpg", { width: 400, quality: 80 });
 *
 * // With multiple transformations
 * const url = buildImageUrl("/products/shoe.jpg", {
 *   width: 800,
 *   height: 600,
 *   format: "webp",
 *   quality: 85,
 *   crop: "maintain_ratio"
 * });
 * ```
 */
export const buildImageUrl = (
  path: string,
  transformations?: ImageTransformations,
): string => {
  if (!transformations) {
    return imagekit.url({
      path,
    });
  }

  const transformation: Record<string, string> = {};

  if (transformations.width) {
    transformation.width = transformations.width.toString();
  }
  if (transformations.height) {
    transformation.height = transformations.height.toString();
  }
  if (transformations.quality) {
    transformation.quality = transformations.quality.toString();
  }
  if (transformations.format) {
    transformation.format = transformations.format;
  }
  if (transformations.blur) {
    transformation.blur = transformations.blur.toString();
  }
  if (transformations.aspectRatio) {
    transformation.aspectRatio = transformations.aspectRatio;
  }
  if (transformations.crop) {
    transformation.crop = transformations.crop;
  }
  if (transformations.cropMode) {
    transformation.cropMode = transformations.cropMode;
  }
  if (transformations.focus) {
    transformation.focus = transformations.focus;
  }
  if (transformations.dpr) {
    transformation.dpr = transformations.dpr.toString();
  }

  return imagekit.url({
    path,
    transformation: [transformation],
  });
};

/**
 * Build a Low Quality Image Placeholder (LQIP) URL
 * Used for progressive image loading with blur effect
 *
 * @param path - The path to the image in ImageKit
 * @returns A low-quality, blurred version of the image URL
 *
 * @example
 * ```tsx
 * const lqip = buildLQIP("/products/shoe.jpg");
 *
 * <img
 *   src={lqip}
 *   data-src={buildImageUrl("/products/shoe.jpg", { width: 800 })}
 *   className="blur-sm transition-all duration-300"
 * />
 * ```
 */
export const buildLQIP = (path: string): string => {
  return buildImageUrl(path, {
    width: 20,
    quality: 20,
    blur: 10,
    format: "auto",
  });
};

/**
 * Common image presets for consistent transformations across the app
 */
export const ImagePresets = {
  /**
   * Thumbnail preset - small square images
   */
  thumbnail: (path: string) =>
    buildImageUrl(path, {
      width: 150,
      height: 150,
      crop: "maintain_ratio",
      quality: 80,
      format: "auto",
    }),

  /**
   * Avatar preset - circular profile images
   */
  avatar: (path: string) =>
    buildImageUrl(path, {
      width: 200,
      height: 200,
      crop: "force",
      quality: 85,
      format: "auto",
    }),

  /**
   * Card preset - images for card components
   */
  card: (path: string) =>
    buildImageUrl(path, {
      width: 400,
      height: 300,
      crop: "maintain_ratio",
      quality: 85,
      format: "auto",
    }),

  /**
   * Hero preset - large banner images
   */
  hero: (path: string) =>
    buildImageUrl(path, {
      width: 1920,
      height: 1080,
      crop: "maintain_ratio",
      quality: 90,
      format: "auto",
    }),

  /**
   * Responsive preset - generates srcset for responsive images
   */
  responsive: (path: string) => ({
    sm: buildImageUrl(path, { width: 640, quality: 85, format: "auto" }),
    md: buildImageUrl(path, { width: 768, quality: 85, format: "auto" }),
    lg: buildImageUrl(path, { width: 1024, quality: 85, format: "auto" }),
    xl: buildImageUrl(path, { width: 1280, quality: 85, format: "auto" }),
    "2xl": buildImageUrl(path, { width: 1536, quality: 85, format: "auto" }),
  }),
} as const;
