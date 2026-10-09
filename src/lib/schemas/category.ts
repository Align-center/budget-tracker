/**
 * Zod validation schemas for Category forms.
 */

import { z } from 'zod';

/**
 * Schema for creating/updating a category (form input)
 * Categories are neutral - type is derived from transaction amount sign
 */
export const categoryInputSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  icon: z.string().min(1, 'Icon is required').max(50, 'Icon is too long'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color (e.g., #FF5733)'),
});

/**
 * Schema for a full category (including system-generated fields)
 */
export const categorySchema = categoryInputSchema.extend({
  id: z.string().uuid('Invalid category ID'),
  createdAt: z.string().datetime('Invalid createdAt timestamp'),
  updatedAt: z.string().datetime('Invalid updatedAt timestamp'),
});

/**
 * Type inference from schemas
 */
export type CategoryInput = z.infer<typeof categoryInputSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
