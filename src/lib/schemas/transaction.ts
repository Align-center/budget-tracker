/**
 * Zod validation schemas for Transaction forms.
 */

import { z } from 'zod';

/**
 * Get today's date in YYYY-MM-DD format for max date validation
 */
const getTodayString = () => new Date().toISOString().split('T')[0];

/**
 * Schema for transaction date validation (YYYY-MM-DD, ≤ today)
 */
const transactionDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
  .refine((date) => date <= getTodayString(), 'Date cannot be in the future');

/**
 * Base schema for transaction (without cross-field validation)
 */
const transactionInputBaseSchema = z.object({
  amount: z.number().refine((val) => val !== 0, 'Amount must not be zero'),
  categoryId: z.string().min(1, 'Category is required'),
  date: transactionDateSchema,
  note: z.string().max(255, 'Note is too long').optional(),
});

/**
 * Schema for creating/updating a transaction (form input)
 */
export const transactionInputSchema = transactionInputBaseSchema;

/**
 * Schema for a full transaction (including system-generated fields)
 */
export const transactionSchema = transactionInputBaseSchema.extend({
  id: z.string().uuid('Invalid transaction ID'),
  createdAt: z.string().datetime('Invalid createdAt timestamp'),
  updatedAt: z.string().datetime('Invalid updatedAt timestamp'),
});

/**
 * Type inference from schemas
 */
export type TransactionInput = z.infer<typeof transactionInputSchema>;
export type TransactionFormData = z.infer<typeof transactionSchema>;

/**
 * Helper to determine transaction type from amount
 * Positive = income, Negative = expense
 */
export const getTransactionType = (amount: number): 'income' | 'expense' =>
  amount > 0 ? 'income' : 'expense';

/**
 * Helper to format amount for display (positive for income, negative for expense)
 */
export const formatTransactionAmount = (amount: number): string => {
  const sign = amount > 0 ? '+' : '';
  return `${sign}${amount.toFixed(2)}`;
};
