import type { CategoryFormData, CategoryInput } from '@/lib/schemas';

/**
 * Repository interface for Category operations
 * Defines the contract for storage implementations (IndexedDB, HTTP, etc.)
 */
export interface CategoryRepository {
  /** Get all categories */
  getAll(): Promise<CategoryFormData[]>;

  /** Get a category by ID */
  getById(id: string): Promise<CategoryFormData | null>;

  /** Get income categories */
  getIncome(): Promise<CategoryFormData[]>;

  /** Get expense categories */
  getExpense(): Promise<CategoryFormData[]>;

  /** Create a new category */
  create(input: CategoryInput): Promise<CategoryFormData>;

  /** Update an existing category */
  update(id: string, input: Partial<CategoryInput>): Promise<CategoryFormData>;

  /** Delete a category */
  delete(id: string): Promise<void>;
}
