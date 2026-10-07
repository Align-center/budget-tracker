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
      // 'month' is a stored field (auto-populated via hook), not just a computed getter
      transactions: 'id, date, categoryId, month, [date+categoryId]',
      categories: 'id, name, isIncome',
      // For budgets, month is only meaningful for monthly periods; store as field for indexing
      budgets: 'id, categoryId, month, [categoryId+month]',
    });

    // Auto-populate 'month' field from 'date' for transactions
    this.transactions.hook('creating', (primKey, obj, trans) => {
      if (obj.date && !obj.month) {
        obj.month = obj.date.slice(0, 7); // YYYY-MM
      }
    });
    this.transactions.hook('updating', (mods, primKey, obj, trans) => {
      if (mods.date && !mods.month) {
        mods.month = mods.date.slice(0, 7);
      }
    });

    // Auto-populate 'month' field from 'startDate' for budgets (monthly periods only)
    this.budgets.hook('creating', (primKey, obj, trans) => {
      if (obj.startDate && !obj.month && obj.period === 'monthly') {
        obj.month = obj.startDate.slice(0, 7);
      }
    });
    this.budgets.hook('updating', (mods, primKey, obj, trans) => {
      if (mods.startDate && !mods.month && (mods.period === 'monthly' || obj.period === 'monthly')) {
        mods.month = mods.startDate.slice(0, 7);
      }
    });

    // Define entity classes with computed properties for convenience
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
  month!: string; // YYYY-MM (auto-populated via hook)
  createdAt!: string;
  updatedAt!: string;

  // Computed property for month-based queries (YYYY-MM)
  // Returns stored month field; falls back to deriving from date
  get monthComputed(): string {
    return this.month ?? this.date.slice(0, 7);
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
  month?: string; // YYYY-MM (auto-populated for monthly periods via hook)
  createdAt!: string;
  updatedAt!: string;

  // For monthly budgets, month is derived from startDate
  // For weekly/yearly, month may be undefined (not a meaningful query dimension)
  get monthComputed(): string | undefined {
    return this.month ?? (this.period === 'monthly' ? this.startDate.slice(0, 7) : undefined);
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
