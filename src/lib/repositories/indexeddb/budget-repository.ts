import { db } from '@/lib/db/dexie';
import type { BudgetRepository } from '../budget-repository';
import type { BudgetFormData, BudgetInput } from '@/lib/schemas';
import { v4 as uuidv4 } from 'uuid';

/**
 * IndexedDB implementation of BudgetRepository
 * Uses Dexie.js for type-safe IndexedDB operations
 */
export class IndexedDBBudgetRepository implements BudgetRepository {
  async getAll(): Promise<BudgetFormData[]> {
    return db.budgets.toArray();
  }

  async getById(id: string): Promise<BudgetFormData | null> {
    const result = await db.budgets.get(id);
    return result ?? null;
  }

  async getByMonth(month: string): Promise<BudgetFormData[]> {
    // month format: YYYY-MM
    return db.budgets.where('month').equals(month).toArray();
  }

  async getByCategoryAndMonth(categoryId: string, month: string): Promise<BudgetFormData | null> {
    const budgets = await db.budgets
      .where('[categoryId+month]')
      .equals([categoryId, month])
      .toArray();
    return budgets[0] ?? null;
  }

  async getByCategory(categoryId: string): Promise<BudgetFormData[]> {
    return db.budgets.where('categoryId').equals(categoryId).toArray();
  }

  async create(input: BudgetInput): Promise<BudgetFormData> {
    const now = new Date().toISOString();
    const budget: BudgetFormData = {
      id: uuidv4(),
      ...input,
      createdAt: now,
      updatedAt: now,
    };

    await db.budgets.add(budget);
    return budget;
  }

  async update(id: string, input: Partial<BudgetInput>): Promise<BudgetFormData> {
    const existing = await db.budgets.get(id);
    if (!existing) {
      throw new Error(`Budget with id ${id} not found`);
    }

    const updated: BudgetFormData = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    await db.budgets.put(updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    await db.budgets.delete(id);
  }
}

/**
 * Singleton instance for dependency injection
 */
export const indexedDBBudgetRepository = new IndexedDBBudgetRepository();
