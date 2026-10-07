/**
 * Barrel file exporting all Zod validation schemas and inferred types.
 * Zod schemas are the single source of truth - types are inferred from them.
 */

// Transaction schemas and types
export { transactionTypeSchema, transactionInputSchema, transactionSchema } from './transaction';
export type { TransactionInput, TransactionFormData } from './transaction';

// Category schemas and types
export { categoryInputSchema, categorySchema } from './category';
export type { CategoryInput, CategoryFormData } from './category';

// Budget schemas and types
export { budgetPeriodSchema, budgetInputSchema, budgetSchema } from './budget';
export type { BudgetInput, BudgetFormData } from './budget';
