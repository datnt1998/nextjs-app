/**
 * Upload configuration options
 */
export interface UploadOptions {
  file: File;
  fileName?: string;
  folder?: string;
  tags?: string[];
  useUniqueFileName?: boolean;
  isPrivateFile?: boolean;
}

/**
 * Upload response from ImageKit
 */
export interface UploadResponse {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  height: number;
  width: number;
  size: number;
  filePath: string;
  fileType: string;
}

/**
 * Error response from upload
 */
export interface UploadError {
  message: string;
  help?: string;
}

/**
 * Validate file before upload
 *
 * @param file - The file to validate
 * @param options - Validation options
 * @returns Validation result with error message if invalid
 */
export const validateFile = (
  file: File,
  options?: {
    maxSizeMB?: number;
    allowedTypes?: string[];
  },
): { valid: boolean; error?: string } => {
  const maxSizeMB = options?.maxSizeMB || 10;
  const allowedTypes = options?.allowedTypes || [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  // Check file size
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > maxSizeMB) {
    return {
      valid: false,
      error: `File size must be less than ${maxSizeMB}MB`,
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type must be one of: ${allowedTypes.join(", ")}`,
    };
  }

  return { valid: true };
};

/**
 * Upload a file to ImageKit using signed upload
 *
 * @param options - Upload configuration
 * @returns Upload response with file details
 *
 * @example
 * ```ts
 * const file = event.target.files[0];
 *
 * try {
 *   const result = await uploadFile({
 *     file,
 *     fileName: "product-image",
 *     folder: "/products",
 *     tags: ["product", "featured"]
 *   });
 *
 *   console.log("Uploaded:", result.url);
 * } catch (error) {
 *   console.error("Upload failed:", error);
 * }
 * ```
 */
export const uploadFile = async (
  options: UploadOptions,
): Promise<UploadResponse> => {
  const {
    file,
    fileName,
    folder,
    tags,
    useUniqueFileName = true,
    isPrivateFile = false,
  } = options;

  // Validate file
  const validation = validateFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Get authentication parameters from API route
  const authResponse = await fetch("/api/imagekit/auth");
  if (!authResponse.ok) {
    throw new Error("Failed to get upload authentication");
  }

  const authData = await authResponse.json();

  // Prepare form data
  const formData = new FormData();
  formData.append("file", file);
  formData.append("publicKey", authData.publicKey);
  formData.append("signature", authData.signature);
  formData.append("expire", authData.expire.toString());
  formData.append("token", authData.token);

  if (fileName) {
    formData.append("fileName", fileName);
  } else {
    formData.append("fileName", file.name);
  }

  if (folder) {
    formData.append("folder", folder);
  }

  if (tags && tags.length > 0) {
    formData.append("tags", tags.join(","));
  }

  formData.append("useUniqueFileName", useUniqueFileName.toString());
  formData.append("isPrivateFile", isPrivateFile.toString());

  // Upload to ImageKit
  const uploadResponse = await fetch(
    "https://upload.imagekit.io/api/v1/files/upload",
    {
      method: "POST",
      body: formData,
    },
  );

  if (!uploadResponse.ok) {
    const errorData = await uploadResponse.json();
    throw new Error(errorData.message || "Upload failed");
  }

  const result = await uploadResponse.json();
  return result;
};

/**
 * Delete a file from ImageKit
 *
 * @param fileId - The ID of the file to delete
 * @returns Success status
 *
 * @example
 * ```ts
 * await deleteFile("file_id_123");
 * ```
 */
export const deleteFile = async (fileId: string): Promise<void> => {
  const response = await fetch("/api/imagekit/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fileId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Delete failed");
  }
};

/**
 * Get file details from ImageKit
 *
 * @param fileId - The ID of the file
 * @returns File details
 */
export const getFileDetails = async (
  fileId: string,
): Promise<UploadResponse> => {
  const response = await fetch(`/api/imagekit/file/${fileId}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to get file details");
  }

  return response.json();
};
