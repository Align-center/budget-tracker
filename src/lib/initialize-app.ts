'use client';

import { useEffect } from 'react';
import { useTransactions } from '@/lib/contexts/TransactionContext';
import { useCategories } from '@/lib/contexts/CategoryContext';
import { useBudgets } from '@/lib/contexts/BudgetContext';
import { initDB } from '@/lib/db/dexie';

/**
 * Initialize app state by loading data from repositories into contexts
 * This should be called once at app startup
 */
export function useInitializeApp(): {
  loading: boolean;
  error: string | null;
} {
  const { loadTransactions, state: transactionState } = useTransactions();
  const { loadCategories, state: categoryState } = useCategories();
  const { loadBudgets, state: budgetState } = useBudgets();

  const loading = transactionState.loading || categoryState.loading || budgetState.loading;
  const error = transactionState.error || categoryState.error || budgetState.error;

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        // Initialize database connection
        await initDB();

        // Load initial data in parallel
        await Promise.all([loadTransactions(), loadCategories(), loadBudgets()]);
      } catch (err) {
        if (mounted) {
          console.error('Failed to initialize app:', err);
        }
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, [loadTransactions, loadCategories, loadBudgets]);

  return { loading, error };
}

/**
 * Initialize database connection only (without loading data)
 * Useful for early initialization
 */
export async function initializeDB(): Promise<void> {
  await initDB();
}
