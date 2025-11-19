"use client";

import { type ChangeEvent, useRef, useState } from "react";
import { Icons } from "@/components/icons/registry";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  type UploadResponse,
  uploadFile,
  validateFile,
} from "@/lib/imagekit/upload";
import { buildImageUrl, buildLQIP } from "@/lib/imagekit/url-builder";

interface ImageUploadFormProps {
  onUploadSuccess?: (result: UploadResponse) => void;
  folder?: string;
  maxSizeMB?: number;
}

export function ImageUploadForm({
  onUploadSuccess,
  folder = "/uploads",
  maxSizeMB = 10,
}: ImageUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<UploadResponse | null>(
    null,
  );
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateFile(file, {
      maxSizeMB,
      allowedTypes: [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ],
    });

    if (!validation.valid) {
      toast({
        title: "Invalid file",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);

    try {
      const result = await uploadFile({
        file: selectedFile,
        folder,
        useUniqueFileName: true,
        tags: ["user-upload"],
      });

      setUploadedImage(result);
      setImageLoading(true);

      toast({
        title: "Upload successful",
        description: "Your image has been uploaded successfully.",
      });

      onUploadSuccess?.(result);

      // Reset form
      setSelectedFile(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description:
          error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Math.round((bytes / k ** i) * 100) / 100} ${sizes[i]}`;
  };

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="file-upload"
              className="block text-sm font-medium mb-2"
            >
              Select Image
            </label>
            <Input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              onChange={handleFileSelect}
              disabled={uploading}
            />
            <p className="text-sm text-muted-foreground mt-2">
              Supported formats: JPEG, PNG, WebP, GIF. Max size: {maxSizeMB}MB
            </p>
          </div>

          {/* Preview */}
          {preview && selectedFile && (
            <div className="space-y-3">
              <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <p>
                  <strong>File:</strong> {selectedFile.name}
                </p>
                <p>
                  <strong>Size:</strong> {formatFileSize(selectedFile.size)}
                </p>
                <p>
                  <strong>Type:</strong> {selectedFile.type}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="flex-1"
            >
              {uploading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Image"
              )}
            </Button>
            {selectedFile && !uploading && (
              <Button onClick={handleClear} variant="outline">
                Clear
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Uploaded Image Display with Transformations */}
      {uploadedImage && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Uploaded Image</h3>
          <div className="space-y-6">
            {/* Original with LQIP */}
            <div>
              <h4 className="text-sm font-medium mb-2">Original (with LQIP)</h4>
              <div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden">
                {imageLoading && (
                  <img
                    src={buildLQIP(uploadedImage.filePath)}
                    alt="Loading placeholder"
                    className="absolute inset-0 w-full h-full object-contain blur-sm"
                  />
                )}
                <img
                  src={buildImageUrl(uploadedImage.filePath)}
                  alt={uploadedImage.name}
                  className={`w-full h-full object-contain transition-opacity duration-300 ${
                    imageLoading ? "opacity-0" : "opacity-100"
                  }`}
                  onLoad={() => setImageLoading(false)}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {uploadedImage.width} × {uploadedImage.height} •{" "}
                {formatFileSize(uploadedImage.size)}
              </p>
            </div>

            {/* Transformations Examples */}
            <div>
              <h4 className="text-sm font-medium mb-3">Transformations</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Thumbnail */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Thumbnail (200×200)
                  </p>
                  <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
                    <img
                      src={buildImageUrl(uploadedImage.filePath, {
                        width: 200,
                        height: 200,
                        crop: "maintain_ratio",
                        quality: 80,
                      })}
                      alt="Thumbnail"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* WebP Format */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    WebP Format (400px)
                  </p>
                  <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
                    <img
                      src={buildImageUrl(uploadedImage.filePath, {
                        width: 400,
                        format: "webp",
                        quality: 85,
                      })}
                      alt="WebP"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Blurred */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Blurred (blur: 20)
                  </p>
                  <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
                    <img
                      src={buildImageUrl(uploadedImage.filePath, {
                        width: 400,
                        blur: 20,
                      })}
                      alt="Blurred"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Low Quality */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Low Quality (quality: 20)
                  </p>
                  <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
                    <img
                      src={buildImageUrl(uploadedImage.filePath, {
                        width: 400,
                        quality: 20,
                      })}
                      alt="Low Quality"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Cropped */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Cropped (300×300)
                  </p>
                  <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
                    <img
                      src={buildImageUrl(uploadedImage.filePath, {
                        width: 300,
                        height: 300,
                        crop: "force",
                      })}
                      alt="Cropped"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* High Quality */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    High Quality (quality: 95)
                  </p>
                  <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
                    <img
                      src={buildImageUrl(uploadedImage.filePath, {
                        width: 400,
                        quality: 95,
                      })}
                      alt="High Quality"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Image Details */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-2">Image Details</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">File ID:</span>
                  <p className="font-mono text-xs break-all">
                    {uploadedImage.fileId}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">File Path:</span>
                  <p className="font-mono text-xs break-all">
                    {uploadedImage.filePath}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">File Type:</span>
                  <p>{uploadedImage.fileType}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Dimensions:</span>
                  <p>
                    {uploadedImage.width} × {uploadedImage.height}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
