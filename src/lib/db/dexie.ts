import Dexie, { type Table } from 'dexie';
import type { TransactionFormData, CategoryFormData, BudgetFormData } from '@/lib/schemas';

/**
 * Budget Tracker Database using Dexie.js
 * IndexedDB wrapper for offline-first storage
 */
export class BudgetTrackerDB extends Dexie {
  transactions!: Table<TransactionFormData, string>;
  categories!: Table<CategoryFormData, string>;
  budgets!: Table<BudgetFormData, string>;

  constructor() {
    super('BudgetTrackerDB');

    this.version(1).stores({
      // Primary key is 'id' (UUID string)
      // Indexes for common query patterns
      transactions: 'id, date, categoryId, [date+categoryId], month',
      categories: 'id, name, isIncome',
      budgets: 'id, categoryId, month, [categoryId+month]',
    });

    // Define computed 'month' field for transactions (derived from date)
    this.transactions.mapToClass(TransactionEntity);
    this.categories.mapToClass(CategoryEntity);
    this.budgets.mapToClass(BudgetEntity);
  }
}

/**
 * Entity classes with computed properties for Dexie
 * These help with indexing and query performance
 */
class TransactionEntity implements TransactionFormData {
  id!: string;
  type!: 'income' | 'expense';
  amount!: number;
  description!: string;
  categoryId!: string;
  date!: string; // YYYY-MM-DD
  createdAt!: string;
  updatedAt!: string;

  // Computed property for month-based queries (YYYY-MM)
  get month(): string {
    return this.date.slice(0, 7);
  }
}

class CategoryEntity implements CategoryFormData {
  id!: string;
  name!: string;
  icon!: string;
  color!: string;
  type!: 'income' | 'expense';
  createdAt!: string;
  updatedAt!: string;

  get isIncome(): boolean {
    return this.type === 'income';
  }
}

class BudgetEntity implements BudgetFormData {
  id!: string;
  categoryId!: string;
  amount!: number;
  period!: 'weekly' | 'monthly' | 'yearly';
  startDate!: string;
  endDate!: string;
  createdAt!: string;
  updatedAt!: string;

  // For monthly budgets, month is derived from startDate
  get month(): string {
    return this.startDate.slice(0, 7);
  }
}

/**
 * Database instance singleton
 * Initialize once and reuse across the app
 */
export const db = new BudgetTrackerDB();

/**
 * Initialize database - opens connection and handles upgrades
 * Call this early in app startup
 */
export async function initDB(): Promise<void> {
  try {
    await db.open();
    console.log('Database opened successfully');
  } catch (error) {
    console.error('Failed to open database:', error);
    throw error;
  }
}

/**
 * Close database connection
 * Useful for cleanup or testing
 */
export async function closeDB(): Promise<void> {
  await db.close();
}
