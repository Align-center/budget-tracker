import type { BudgetFormData, BudgetInput } from '@/lib/schemas';

/**
 * Repository interface for Budget operations
 * Defines the contract for storage implementations (IndexedDB, HTTP, etc.)
 */
export interface BudgetRepository {
  /** Get all budgets */
  getAll(): Promise<BudgetFormData[]>;

  /** Get a budget by ID */
  getById(id: string): Promise<BudgetFormData | null>;

  /** Get budgets for a specific month (YYYY-MM) */
  getByMonth(month: string): Promise<BudgetFormData[]>;

  /** Get budget for a specific category and month */
  getByCategoryAndMonth(categoryId: string, month: string): Promise<BudgetFormData | null>;

  /** Get budgets for a specific category */
  getByCategory(categoryId: string): Promise<BudgetFormData[]>;

  /** Create a new budget */
  create(input: BudgetInput): Promise<BudgetFormData>;

  /** Update an existing budget */
  update(id: string, input: Partial<BudgetInput>): Promise<BudgetFormData>;

  /** Delete a budget */
  delete(id: string): Promise<void>;
}
