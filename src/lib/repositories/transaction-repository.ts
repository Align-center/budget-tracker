import type { TransactionFormData, TransactionInput } from '@/lib/schemas';

/**
 * Repository interface for Transaction operations
 * Defines the contract for storage implementations (IndexedDB, HTTP, etc.)
 */
export interface TransactionRepository {
  /** Get all transactions */
  getAll(): Promise<TransactionFormData[]>;

  /** Get a transaction by ID */
  getById(id: string): Promise<TransactionFormData | null>;

  /** Get transactions for a specific month (YYYY-MM) */
  getByMonth(month: string): Promise<TransactionFormData[]>;

  /** Get transactions for a specific category */
  getByCategory(categoryId: string): Promise<TransactionFormData[]>;

  /** Get transactions within a date range */
  getByDateRange(startDate: string, endDate: string): Promise<TransactionFormData[]>;

  /** Get summary: total income, total expense, net for a month */
  getSummary(month: string): Promise<{
    income: number;
    expense: number;
    net: number;
  }>;

  /** Create a new transaction */
  create(input: TransactionInput): Promise<TransactionFormData>;

  /** Update an existing transaction */
  update(id: string, input: Partial<TransactionInput>): Promise<TransactionFormData>;

  /** Delete a transaction */
  delete(id: string): Promise<void>;

  /** Bulk insert transactions (for import) */
  bulkCreate(transactions: TransactionInput[]): Promise<TransactionFormData[]>;
}
