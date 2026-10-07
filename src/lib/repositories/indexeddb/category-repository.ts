import { db } from '@/lib/db/dexie';
import type { CategoryRepository } from '../category-repository';
import type { CategoryFormData, CategoryInput } from '@/lib/schemas';
import { v4 as uuidv4 } from 'uuid';

/**
 * IndexedDB implementation of CategoryRepository
 * Uses Dexie.js for type-safe IndexedDB operations
 */
export class IndexedDBCategoryRepository implements CategoryRepository {
  async getAll(): Promise<CategoryFormData[]> {
    return db.categories.toArray();
  }

  async getById(id: string): Promise<CategoryFormData | null> {
    const result = await db.categories.get(id);
    return result ?? null;
  }

  async getIncome(): Promise<CategoryFormData[]> {
    return db.categories.where('type').equals('income').toArray();
  }

  async getExpense(): Promise<CategoryFormData[]> {
    return db.categories.where('type').equals('expense').toArray();
  }

  async create(input: CategoryInput): Promise<CategoryFormData> {
    const now = new Date().toISOString();
    const category: CategoryFormData = {
      id: uuidv4(),
      ...input,
      createdAt: now,
      updatedAt: now,
    };

    await db.categories.add(category);
    return category;
  }

  async update(id: string, input: Partial<CategoryInput>): Promise<CategoryFormData> {
    const existing = await db.categories.get(id);
    if (!existing) {
      throw new Error(`Category with id ${id} not found`);
    }

    const updated: CategoryFormData = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    await db.categories.put(updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    await db.categories.delete(id);
  }
}

/**
 * Singleton instance for dependency injection
 */
export const indexedDBCategoryRepository = new IndexedDBCategoryRepository();
