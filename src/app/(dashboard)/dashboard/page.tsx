'use client';

import { cn } from '@/lib/utils';
import { useReports } from '@/hooks/useReports';
import { SpendingByCategoryChart, IncomeExpenseChart } from '@/components/charts';
import { EmptyState } from '@/components/ui/EmptyState';

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
        <EmptyState
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          }
          title="No data to display"
          description="Start adding transactions to see your spending breakdown and income vs expense overview."
          cta={{ label: 'Add Transaction', href: '/transactions' }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Charts */}
      <div className={cn('gap-6', 'grid grid-cols-1', 'md:grid-cols-2')}>
        <SpendingByCategoryChart data={spendingByCategory} />
        <IncomeExpenseChart income={incomeVsExpense.income} expense={incomeVsExpense.expense} />
      </div>
    </div>
  );
}
