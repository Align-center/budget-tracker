'use client';

import { useState, useCallback, useEffect } from 'react';
import type { TransactionFormData, TransactionInput } from '@/lib/schemas';
import { transactionDb } from '@/lib/db';

interface UseTransactionsReturn {
  transactions: TransactionFormData[];
  loading: boolean;
  error: string | null;
  addTransaction: (input: TransactionInput) => Promise<TransactionFormData | null>;
  updateTransaction: (
    id: string,
    input: Partial<TransactionInput>
  ) => Promise<TransactionFormData | null>;
  deleteTransaction: (id: string) => Promise<boolean>;
  refreshTransactions: () => Promise<void>;
}

export function useTransactions(): UseTransactionsReturn {
  const [transactions, setTransactions] = useState<TransactionFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await transactionDb.getAll();
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshTransactions();
  }, [refreshTransactions]);

  const addTransaction = useCallback(
    async (input: TransactionInput): Promise<TransactionFormData | null> => {
      try {
        setError(null);
        const newTransaction = await transactionDb.create(input);
        setTransactions((prev) =>
          [...prev, newTransaction].sort((a, b) => (b.date > a.date ? 1 : -1))
        );
        return newTransaction;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create transaction');
        return null;
      }
    },
    []
  );

  const updateTransaction = useCallback(
    async (id: string, input: Partial<TransactionInput>): Promise<TransactionFormData | null> => {
      try {
        setError(null);
        const updated = await transactionDb.update(id, input);
        if (updated) {
          setTransactions((prev) =>
            prev.map((t) => (t.id === id ? updated : t)).sort((a, b) => (b.date > a.date ? 1 : -1))
          );
        }
        return updated ?? null;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update transaction');
        return null;
      }
    },
    []
  );

  const deleteTransaction = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const success = await transactionDb.delete(id);
      if (success) {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete transaction');
      return false;
    }
  }, []);

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions,
  };
}
