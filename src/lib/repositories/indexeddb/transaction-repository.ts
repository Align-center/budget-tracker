import { db } from '@/lib/db/dexie';
import type { TransactionRepository } from '../transaction-repository';
import type { TransactionFormData, TransactionInput } from '@/lib/schemas';
import { v4 as uuidv4 } from 'uuid';

/**
 * IndexedDB implementation of TransactionRepository
 * Uses Dexie.js for type-safe IndexedDB operations
 */
export class IndexedDBTransactionRepository implements TransactionRepository {
  async getAll(): Promise<TransactionFormData[]> {
    return db.transactions.toArray();
  }

  async getById(id: string): Promise<TransactionFormData | null> {
    const result = await db.transactions.get(id);
    return result ?? null;
  }

  async getByMonth(month: string): Promise<TransactionFormData[]> {
    // month format: YYYY-MM
    return db.transactions.where('month').equals(month).toArray();
  }

  async getByCategory(categoryId: string): Promise<TransactionFormData[]> {
    return db.transactions.where('categoryId').equals(categoryId).toArray();
  }

  async getByDateRange(startDate: string, endDate: string): Promise<TransactionFormData[]> {
    return db.transactions.where('date').between(startDate, endDate, true, true).toArray();
  }

  async getSummary(month: string): Promise<{
    income: number;
    expense: number;
    net: number;
  }> {
    const transactions = await this.getByMonth(month);
    let income = 0;
    let expense = 0;

    for (const t of transactions) {
      if (t.type === 'income') {
        income += t.amount;
      } else {
        expense += t.amount;
      }
    }

    return {
      income,
      expense,
      net: income + expense, // expense is negative
    };
  }

  async create(input: TransactionInput): Promise<TransactionFormData> {
    const now = new Date().toISOString();
    const transaction: TransactionFormData = {
      id: uuidv4(),
      ...input,
      createdAt: now,
      updatedAt: now,
    };

    await db.transactions.add(transaction);
    return transaction;
  }

  async update(id: string, input: Partial<TransactionInput>): Promise<TransactionFormData> {
    const existing = await db.transactions.get(id);
    if (!existing) {
      throw new Error(`Transaction with id ${id} not found`);
    }

    const updated: TransactionFormData = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    await db.transactions.put(updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    await db.transactions.delete(id);
  }

  async bulkCreate(transactions: TransactionInput[]): Promise<TransactionFormData[]> {
    const now = new Date().toISOString();
    const transactionsWithMeta: TransactionFormData[] = transactions.map((t) => ({
      id: uuidv4(),
      ...t,
      createdAt: now,
      updatedAt: now,
    }));

    await db.transactions.bulkAdd(transactionsWithMeta);
    return transactionsWithMeta;
  }
}

/**
 * Singleton instance for dependency injection
 */
export const indexedDBTransactionRepository = new IndexedDBTransactionRepository();
