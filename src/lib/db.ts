import Dexie, { Table } from 'dexie';
import type { CategoryFormData, TransactionFormData } from '@/lib/schemas';

export class BudgetTrackerDB extends Dexie {
  categories!: Table<CategoryFormData, string>;
  transactions!: Table<TransactionFormData, string>;

  constructor() {
    super('BudgetTrackerDB');
    this.version(1).stores({
      categories: 'id, name, icon, color, createdAt, updatedAt',
      transactions: 'id, categoryId, date, amount, createdAt, updatedAt',
    });
  }
}

export const db = new BudgetTrackerDB();

/**
 * Category CRUD operations
 */
export const categoryDb = {
  async getAll(): Promise<CategoryFormData[]> {
    return db.categories.orderBy('name').toArray();
  },

  async getById(id: string): Promise<CategoryFormData | undefined> {
    return db.categories.get(id);
  },

  async create(
    input: Omit<CategoryFormData, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<CategoryFormData> {
    const now = new Date().toISOString();
    const category: CategoryFormData = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    await db.categories.add(category);
    return category;
  },

  async update(
    id: string,
    input: Partial<Omit<CategoryFormData, 'id' | 'createdAt'>>
  ): Promise<CategoryFormData | undefined> {
    const existing = await db.categories.get(id);
    if (!existing) return undefined;

    const updated: CategoryFormData = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    };
    await db.categories.put(updated);
    return updated;
  },

  async delete(id: string): Promise<boolean> {
    const deleted = await db.categories.delete(id);
    return (deleted ?? 0) > 0;
  },

  async nameExists(name: string, excludeId?: string): Promise<boolean> {
    const category = await db.categories.where('name').equalsIgnoreCase(name).first();
    return category !== undefined && category.id !== excludeId;
  },
};

/**
 * Transaction CRUD operations
 */
export const transactionDb = {
  async getAll(): Promise<TransactionFormData[]> {
    return db.transactions.orderBy('date').reverse().toArray();
  },

  async create(
    input: Omit<TransactionFormData, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<TransactionFormData> {
    const now = new Date().toISOString();
    const transaction: TransactionFormData = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    await db.transactions.add(transaction);
    return transaction;
  },

  async update(
    id: string,
    input: Partial<Omit<TransactionFormData, 'id' | 'createdAt'>>
  ): Promise<TransactionFormData | undefined> {
    const existing = await db.transactions.get(id);
    if (!existing) return undefined;

    const updated: TransactionFormData = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    };
    await db.transactions.put(updated);
    return updated;
  },

  async delete(id: string): Promise<boolean> {
    const deleted = await db.transactions.delete(id);
    return (deleted ?? 0) > 0;
  },
};
