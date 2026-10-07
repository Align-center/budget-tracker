/**
 * Zod validation schemas for Transaction forms.
 */

import { z } from 'zod';

/**
 * Schema for transaction type enum
 */
export const transactionTypeSchema = z.enum(['income', 'expense']);

/**
 * Schema for creating/updating a transaction (form input)
 */
export const transactionInputSchema = z.object({
  type: transactionTypeSchema,
  amount: z.number().positive('Amount must be greater than 0'),
  description: z.string().min(1, 'Description is required').max(255, 'Description is too long'),
  categoryId: z.string().min(1, 'Category is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

/**
 * Schema for a full transaction (including system-generated fields)
 */
export const transactionSchema = transactionInputSchema.extend({
  id: z.string().uuid('Invalid transaction ID'),
  createdAt: z.string().datetime('Invalid createdAt timestamp'),
  updatedAt: z.string().datetime('Invalid updatedAt timestamp'),
});

/**
 * Type inference from schemas
 */
export type TransactionInput = z.infer<typeof transactionInputSchema>;
export type TransactionFormData = z.infer<typeof transactionSchema>;
