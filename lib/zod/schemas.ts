import { z } from "zod";

/**
 * Login schema for authentication
 */
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

/**
 * Item schema for CRUD operations
 */
export const itemSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z
    .string()
    .max(500, "Description too long")
    .optional()
    .nullable(),
  status: z.enum(["active", "inactive", "archived"]).default("active"),
  image_url: z.string().url("Invalid image URL").optional().nullable(),
});

/**
 * Item update schema (all fields optional)
 */
export const itemUpdateSchema = itemSchema.partial();

/**
 * TypeScript types inferred from schemas
 */
export type LoginInput = z.infer<typeof loginSchema>;
export type ItemInput = z.infer<typeof itemSchema>;
export type ItemUpdateInput = z.infer<typeof itemUpdateSchema>;
