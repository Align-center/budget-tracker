'use client';

import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReports } from '@/hooks/useReports';
import { SpendingByCategoryChart, IncomeExpenseChart } from '@/components/charts';
import { formatCurrency } from '@/lib/schemas/transaction';

export default function DashboardPage() {
  const { spendingByCategory, incomeVsExpense, loading, error } = useReports();

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              data-testid="loading-skeleton"
              className="h-72 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-700"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="py-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-100">
            Failed to load reports
          </h3>
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">{error}</p>
        </div>
      </div>
    );
  }

  const hasData =
    spendingByCategory.length > 0 || incomeVsExpense.income > 0 || incomeVsExpense.expense > 0;

  if (!hasData) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="py-16 text-center">
          <svg
            className="mx-auto mb-6 h-16 w-16 text-zinc-300 dark:text-zinc-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            No data to display
          </h2>
          <p className="mx-auto mb-6 max-w-md text-zinc-500 dark:text-zinc-400">
            Start adding transactions to see your spending breakdown and income vs expense overview.
          </p>
          <a
            href="/transactions"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Add Transaction
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Balance Summary */}
      <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="text-center">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Income</p>
            <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(incomeVsExpense.income)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Expenses</p>
            <p className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(incomeVsExpense.expense)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Balance</p>
            <p
              className={cn(
                'mt-1 text-2xl font-bold',
                incomeVsExpense.balance >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              )}
            >
              {formatCurrency(incomeVsExpense.balance)}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className={cn('gap-6', 'grid grid-cols-1', 'md:grid-cols-2')}>
        <SpendingByCategoryChart data={spendingByCategory} />
        <IncomeExpenseChart income={incomeVsExpense.income} expense={incomeVsExpense.expense} />
      </div>
    </div>
  );
}
