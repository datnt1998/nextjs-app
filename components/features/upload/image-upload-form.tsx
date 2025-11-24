"use client";

import { useTranslations } from "next-intl";
import { type ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { Icons } from "@/components/icons/registry";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  const t = useTranslations("upload.form");
  const tUploaded = useTranslations("upload.uploaded");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<UploadResponse | null>(
    null
  );
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      toast.error(t("invalidFile"), {
        description: validation.error,
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

      toast.success(t("uploadSuccess"), {
        description: t("uploadSuccessDescription"),
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
      toast.error(t("uploadFailed"), {
        description: error instanceof Error ? error.message : t("uploadFailed"),
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
              {t("selectImage")}
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
              {t("supportedFormats", { maxSize: maxSizeMB })}
            </p>
          </div>

          {/* Preview */}
          {preview && selectedFile && (
            <div className="space-y-3">
              <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden">
                <img
                  src={preview}
                  alt={t("preview")}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <p>
                  <strong>{t("file")}:</strong> {selectedFile.name}
                </p>
                <p>
                  <strong>{t("size")}:</strong>{" "}
                  {formatFileSize(selectedFile.size)}
                </p>
                <p>
                  <strong>{t("type")}:</strong> {selectedFile.type}
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
                  {t("uploading")}
                </>
              ) : (
                t("uploadImage")
              )}
            </Button>
            {selectedFile && !uploading && (
              <Button onClick={handleClear} variant="outline">
                {t("clear")}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Uploaded Image Display with Transformations */}
      {uploadedImage && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">{tUploaded("title")}</h3>
          <div className="space-y-6">
            {/* Original with LQIP */}
            <div>
              <h4 className="text-sm font-medium mb-2">
                {tUploaded("original")}
              </h4>
              <div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden">
                {imageLoading && (
                  <img
                    src={buildLQIP(uploadedImage.filePath)}
                    alt={tUploaded("loadingPlaceholder")}
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
              <h4 className="text-sm font-medium mb-3">
                {tUploaded("transformations")}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Thumbnail */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {tUploaded("thumbnail")}
                  </p>
                  <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
                    <img
                      src={buildImageUrl(uploadedImage.filePath, {
                        width: 200,
                        height: 200,
                        crop: "maintain_ratio",
                        quality: 80,
                      })}
                      alt={tUploaded("thumbnail")}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* WebP Format */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {tUploaded("webpFormat")}
                  </p>
                  <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
                    <img
                      src={buildImageUrl(uploadedImage.filePath, {
                        width: 400,
                        format: "webp",
                        quality: 85,
                      })}
                      alt={tUploaded("webpFormat")}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Blurred */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {tUploaded("blurred")}
                  </p>
                  <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
                    <img
                      src={buildImageUrl(uploadedImage.filePath, {
                        width: 400,
                        blur: 20,
                      })}
                      alt={tUploaded("blurred")}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Low Quality */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {tUploaded("lowQuality")}
                  </p>
                  <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
                    <img
                      src={buildImageUrl(uploadedImage.filePath, {
                        width: 400,
                        quality: 20,
                      })}
                      alt={tUploaded("lowQuality")}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Cropped */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {tUploaded("cropped")}
                  </p>
                  <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
                    <img
                      src={buildImageUrl(uploadedImage.filePath, {
                        width: 300,
                        height: 300,
                        crop: "force",
                      })}
                      alt={tUploaded("cropped")}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* High Quality */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {tUploaded("highQuality")}
                  </p>
                  <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
                    <img
                      src={buildImageUrl(uploadedImage.filePath, {
                        width: 400,
                        quality: 95,
                      })}
                      alt={tUploaded("highQuality")}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Image Details */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-2">
                {tUploaded("imageDetails")}
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">
                    {tUploaded("fileId")}
                  </span>
                  <p className="font-mono text-xs break-all">
                    {uploadedImage.fileId}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    {tUploaded("filePath")}
                  </span>
                  <p className="font-mono text-xs break-all">
                    {uploadedImage.filePath}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    {tUploaded("fileType")}
                  </span>
                  <p>{uploadedImage.fileType}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    {tUploaded("dimensions")}
                  </span>
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
