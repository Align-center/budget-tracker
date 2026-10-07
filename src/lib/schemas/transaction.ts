/**
 * Zod validation schemas for Transaction forms.
 */

import { z } from 'zod';

/**
 * Schema for transaction type enum
 */
export const transactionTypeSchema = z.enum(['income', 'expense']);

/**
 * Base schema for transaction (without cross-field validation)
 */
const transactionInputBaseSchema = z.object({
  type: transactionTypeSchema,
  amount: z.number(),
  description: z.string().min(1, 'Description is required').max(255, 'Description is too long'),
  categoryId: z.string().min(1, 'Category is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

/**
 * Cross-field validation: amount sign must match type
 * - income: amount must be positive
 * - expense: amount must be negative
 */
const amountMatchesType = (data: z.infer<typeof transactionInputBaseSchema>) => {
  if (data.type === 'income') {
    return data.amount > 0;
  }
  return data.amount < 0;
};

/**
 * Schema for creating/updating a transaction (form input)
 */
export const transactionInputSchema = transactionInputBaseSchema
  .refine((data) => data.amount !== 0, {
    message: 'Amount must not be zero',
    path: ['amount'],
  })
  .refine(amountMatchesType, {
    message: 'Amount must be positive for income and negative for expense',
    path: ['amount'],
  });

/**
 * Schema for a full transaction (including system-generated fields)
 */
export const transactionSchema = transactionInputBaseSchema
  .extend({
    id: z.string().uuid('Invalid transaction ID'),
    createdAt: z.string().datetime('Invalid createdAt timestamp'),
    updatedAt: z.string().datetime('Invalid updatedAt timestamp'),
  })
  .refine((data) => data.amount !== 0, {
    message: 'Amount must not be zero',
    path: ['amount'],
  })
  .refine(amountMatchesType, {
    message: 'Amount must be positive for income and negative for expense',
    path: ['amount'],
  });

/**
 * Type inference from schemas
 */
export type TransactionInput = z.infer<typeof transactionInputSchema>;
export type TransactionFormData = z.infer<typeof transactionSchema>;
