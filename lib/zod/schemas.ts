import { z } from "zod";

/**
 * Login schema for authentication
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email({ message: "Invalid email address" }),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

/**
 * Sign up schema for user registration
 */
export const signUpSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long"),
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Full name is too long"),
});

/**
 * Item schema for CRUD operations (for forms)
 */
export const itemSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z
    .string()
    .max(500, "Description too long")
    .optional()
    .nullable(),
  status: z.enum(["active", "inactive", "archived"]),
  image_url: z
    .string()
    .url({ message: "Invalid image URL" })
    .optional()
    .nullable()
    .or(z.literal("")),
});

/**
 * Item create schema (for API - with defaults)
 */
export const itemCreateSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z
    .string()
    .max(500, "Description too long")
    .optional()
    .nullable(),
  status: z.enum(["active", "inactive", "archived"]).default("active"),
  image_url: z
    .string()
    .url({ message: "Invalid image URL" })
    .optional()
    .nullable()
    .or(z.literal("")),
});

/**
 * Item update schema (all fields optional)
 */
export const itemUpdateSchema = itemSchema.partial();

/**
 * TypeScript types inferred from schemas
 */
export type LoginInput = z.infer<typeof loginSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type ItemInput = z.infer<typeof itemSchema>;
export type ItemCreateInput = z.infer<typeof itemCreateSchema>;
export type ItemUpdateInput = z.infer<typeof itemUpdateSchema>;
