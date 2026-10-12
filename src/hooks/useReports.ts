'use client';

import { useMemo } from 'react';
import { useTransactions } from './useTransactions';
import { useCategories } from './useCategories';

export interface SpendingByCategoryItem {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
  amount: number;
}

export interface IncomeVsExpense {
  income: number;
  expense: number;
  balance: number;
}

export interface UseReportsReturn {
  spendingByCategory: SpendingByCategoryItem[];
  incomeVsExpense: IncomeVsExpense;
  loading: boolean;
  error: string | null;
}

/**
 * Derives report data from transactions and categories.
 * - spendingByCategory: expenses grouped by category, summed absolute amounts, joined with category info
 * - incomeVsExpense: sum positive = income, sum absolute negative = expense
 * - Memoized for performance
 * - Loading/error states derived from transactions hook
 */
export function useReports(): UseReportsReturn {
  const { transactions, loading, error } = useTransactions();
  const { categories } = useCategories();

  const spendingByCategory = useMemo((): SpendingByCategoryItem[] => {
    // Filter only expenses (negative amounts)
    const expenses = transactions.filter((t) => t.amount < 0);

    // Group by categoryId and sum absolute amounts
    const categoryTotals = new Map<string, number>();
    for (const txn of expenses) {
      const current = categoryTotals.get(txn.categoryId) ?? 0;
      categoryTotals.set(txn.categoryId, current + Math.abs(txn.amount));
    }

    // Join with category info and sort by amount descending
    return Array.from(categoryTotals.entries())
      .map(([categoryId, amount]) => {
        const category = categories.find((c) => c.id === categoryId);
        return {
          categoryId,
          categoryName: category?.name ?? 'Unknown',
          categoryColor: category?.color ?? '#6b7280',
          categoryIcon: category?.icon ?? '📦',
          amount,
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, categories]);

  const incomeVsExpense = useMemo((): IncomeVsExpense => {
    let income = 0;
    let expense = 0;

    for (const txn of transactions) {
      if (txn.amount > 0) {
        income += txn.amount;
      } else {
        expense += Math.abs(txn.amount);
      }
    }

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [transactions]);

  return {
    spendingByCategory,
    incomeVsExpense,
    loading,
    error,
  };
}
