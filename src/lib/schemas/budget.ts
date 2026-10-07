/**
 * Zod validation schemas for Budget forms.
 */

import { z } from 'zod';

/**
 * Budget period enum
 */
export const budgetPeriodSchema = z.enum(['weekly', 'monthly', 'yearly']);

/**
 * Base schema for budget (without cross-field validation)
 */
const budgetBaseSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  amount: z.number().positive('Amount must be greater than 0'),
  period: budgetPeriodSchema,
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format'),
});

/**
 * Schema for creating/updating a budget (form input) with cross-field validation
 */
export const budgetInputSchema = budgetBaseSchema.refine(
  (data) => new Date(data.startDate) <= new Date(data.endDate),
  {
    message: 'Start date must be before or equal to end date',
    path: ['startDate'],
  }
);

/**
 * Schema for a full budget (including system-generated fields)
 */
export const budgetSchema = budgetBaseSchema
  .extend({
    id: z.string().uuid('Invalid budget ID'),
    createdAt: z.string().datetime('Invalid createdAt timestamp'),
    updatedAt: z.string().datetime('Invalid updatedAt timestamp'),
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: 'Start date must be before or equal to end date',
    path: ['startDate'],
  });

/**
 * Type inference from schemas
 */
export type BudgetInput = z.infer<typeof budgetInputSchema>;
export type BudgetFormData = z.infer<typeof budgetSchema>;
