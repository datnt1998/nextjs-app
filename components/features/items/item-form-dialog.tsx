"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Item } from "@/lib/api/items";
import { createItem, updateItem } from "@/lib/api/items";
import { uploadFile, validateFile } from "@/lib/imagekit/upload";
import { itemsKeys } from "@/lib/query-keys/items";
import { type ItemInput, itemSchema } from "@/lib/zod/schemas";

interface ItemFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: Item | null;
}

export function ItemFormDialog({
  open,
  onOpenChange,
  item,
}: ItemFormDialogProps) {
  const t = useTranslations("items.form");
  const queryClient = useQueryClient();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    item?.image_url || null
  );
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<ItemInput>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "active" as const,
      image_url: "",
    },
  });

  // Reset form when item changes or dialog opens/closes
  useEffect(() => {
    if (open) {
      if (item) {
        form.reset({
          title: item.title,
          description: item.description || "",
          status: item.status,
          image_url: item.image_url || "",
        });
        setImagePreview(item.image_url);
      } else {
        form.reset({
          title: "",
          description: "",
          status: "active",
          image_url: "",
        });
        setImagePreview(null);
      }
      setImageFile(null);
    }
  }, [item, open, form]);

  const createMutation = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemsKeys.root });
      toast.success(t("createSuccess"));
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || t("saveFailed"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ItemInput }) =>
      updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemsKeys.root });
      toast.success(t("updateSuccess"));
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || t("saveFailed"));
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file, {
      maxSizeMB: 5,
      allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    });

    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    form.setValue("image_url", "");
  };

  const onSubmit = async (data: ItemInput) => {
    try {
      let imageUrl = data.image_url;

      // Upload image if a new file is selected
      if (imageFile) {
        setIsUploading(true);
        try {
          const uploadResult = await uploadFile({
            file: imageFile,
            folder: "/items",
            useUniqueFileName: true,
          });
          imageUrl = uploadResult.url;
        } catch (_error) {
          toast.error(t("uploadFailed"));
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }

      const itemData = {
        ...data,
        image_url: imageUrl || null,
      };

      if (item) {
        updateMutation.mutate({ id: item.id, data: itemData });
      } else {
        createMutation.mutate(itemData);
      }
    } catch (_error) {
      toast.error(t("saveFailed"));
    }
  };

  const isLoading =
    createMutation.isPending || updateMutation.isPending || isUploading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? t("editTitle") : t("createTitle")}</DialogTitle>
          <DialogDescription>
            {item ? t("editDescription") : t("createDescription")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("title")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("titlePlaceholder")}
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("description")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("descriptionPlaceholder")}
                      className="resize-none"
                      rows={4}
                      {...field}
                      value={field.value || ""}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("descriptionCounter", {
                      count: field.value?.length || 0,
                    })}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("status")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">
                        {t("statusActive")}
                      </SelectItem>
                      <SelectItem value="inactive">
                        {t("statusInactive")}
                      </SelectItem>
                      <SelectItem value="archived">
                        {t("statusArchived")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image_url"
              render={() => (
                <FormItem>
                  <FormLabel>{t("image")}</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {imagePreview ? (
                        <div className="relative">
                          <div className="relative h-48 w-full overflow-hidden rounded-lg border">
                            <Image
                              src={imagePreview}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={handleRemoveImage}
                            disabled={isLoading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-full">
                          <label
                            htmlFor="image-upload"
                            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                              <p className="mb-2 text-sm text-muted-foreground">
                                <span className="font-semibold">
                                  {t("imageUploadPrompt")}
                                </span>{" "}
                                {t("imageUploadOr")}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {t("imageUploadFormats")}
                              </p>
                            </div>
                            <input
                              id="image-upload"
                              type="file"
                              className="hidden"
                              accept="image/jpeg,image/jpg,image/png,image/webp"
                              onChange={handleImageChange}
                              disabled={isLoading}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>{t("imageHint")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isUploading
                  ? t("uploading")
                  : isLoading
                    ? t("saving")
                    : item
                      ? t("update")
                      : t("submit")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
