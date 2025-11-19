"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icons } from "@/components/icons/registry";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCreateItem, useUpdateItem } from "@/hooks/use-items";
import { useToast } from "@/hooks/use-toast";
import { uploadFile, validateFile } from "@/lib/imagekit/upload";
import { buildImageUrl, buildLQIP } from "@/lib/imagekit/url-builder";
import type { Database } from "@/types/database.types";

type Item = Database["public"]["Tables"]["items"]["Row"];
type ItemStatus = Database["public"]["Tables"]["items"]["Row"]["status"];

interface ItemFormProps {
  item?: Item;
  mode: "create" | "edit";
}

export function ItemForm({ item, mode }: ItemFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const createItem = useCreateItem();
  const updateItem = useUpdateItem();

  const [title, setTitle] = useState(item?.title || "");
  const [description, setDescription] = useState(item?.description || "");
  const [status, setStatus] = useState<ItemStatus>(item?.status || "active");
  const [imageUrl, setImageUrl] = useState(item?.image_url || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    item?.image_url || null,
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateFile(file, {
      maxSizeMB: 5,
      allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    });

    if (!validation.valid) {
      toast({
        title: "Invalid file",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalImageUrl = imageUrl;

      // Upload image if a new file was selected
      if (imageFile) {
        setIsUploading(true);
        try {
          const uploadResult = await uploadFile({
            file: imageFile,
            folder: "/items",
            useUniqueFileName: true,
          });
          finalImageUrl = uploadResult.url;
        } catch (uploadError) {
          toast({
            title: "Image upload failed",
            description:
              uploadError instanceof Error
                ? uploadError.message
                : "Failed to upload image",
            variant: "destructive",
          });
          setIsSubmitting(false);
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }

      const itemData = {
        title,
        description: description || null,
        status,
        image_url: finalImageUrl || null,
      };

      if (mode === "create") {
        await createItem.mutateAsync(itemData as any);
        toast({
          title: "Success",
          description: "Item created successfully",
        });
        router.push("/dashboard/items");
      } else if (item) {
        await updateItem.mutateAsync({
          id: item.id,
          ...itemData,
        });
        toast({
          title: "Success",
          description: "Item updated successfully",
        });
        router.push(`/dashboard/items/${item.id}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save item",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-semibold">
          {mode === "create" ? "Create New Item" : "Edit Item"}
        </h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-danger">*</span>
            </label>
            <Input
              id="title"
              type="text"
              placeholder="Enter item title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Enter item description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            <p className="text-xs text-muted-foreground">
              {description.length}/500 characters
            </p>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status <span className="text-danger">*</span>
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as ItemStatus)}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label htmlFor="image" className="text-sm font-medium">
              Image
            </label>
            <Input
              id="image"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageChange}
              disabled={isUploading}
            />
            <p className="text-xs text-muted-foreground">
              Max file size: 5MB. Supported formats: JPEG, PNG, WebP
            </p>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium">Preview:</p>
                <div className="relative h-48 w-full overflow-hidden rounded-md border border-border">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting || isUploading || !title}
              className="flex items-center gap-2"
            >
              {isSubmitting || isUploading ? (
                <>
                  <Icons.spinner className="h-4 w-4 animate-spin" />
                  {isUploading ? "Uploading..." : "Saving..."}
                </>
              ) : (
                <>{mode === "create" ? "Create Item" : "Update Item"}</>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting || isUploading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
