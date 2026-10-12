'use client';

import dynamic from 'next/dynamic';
import type { SpendingByCategoryItem } from '@/hooks/useReports';
import { chartTheme, formatCurrency } from './chartTheme';
import type { TooltipItem } from 'chart.js';

// SSR-safe dynamic import for Chart.js components
const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), { ssr: false });

interface SpendingByCategoryChartProps {
  data: SpendingByCategoryItem[];
  className?: string;
}

export type { SpendingByCategoryChartProps };

/**
 * Horizontal bar chart showing spending by category.
 * - Y-axis: category name with colored dot
 * - X-axis: amount (currency)
 * - Bars colored by category.color
 * - Tooltips with formatted currency
 */
export function SpendingByCategoryChart({ data, className = '' }: SpendingByCategoryChartProps) {
  if (!data.length) {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-12 dark:border-zinc-700 dark:bg-zinc-800 ${className} `}
        role="img"
        aria-label="No spending data available"
      >
        <svg
          className="mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-600"
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
        <p className="text-center text-zinc-500 dark:text-zinc-400">No spending data yet</p>
      </div>
    );
  }

  // Prepare chart data
  const labels = data.map((d) => d.categoryName);
  const amounts = data.map((d) => d.amount);
  const colors = data.map((d) => d.categoryColor);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Spending',
        data: amounts,
        backgroundColor: colors,
        borderColor: colors.map((c) => c + 'CC'), // 80% opacity for border
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 40,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    ...chartTheme.defaultOptions,
    plugins: {
      ...chartTheme.defaultOptions.plugins,
      tooltip: {
        ...chartTheme.defaultOptions.plugins!.tooltip,
        callbacks: {
          label: (context: TooltipItem<'bar'>) => {
            const value = context.parsed.x ?? 0;
            return `Spent: ${formatCurrency(value)}`;
          },
        },
      },
    },
    scales: {
      ...chartTheme.defaultOptions.scales,
      x: {
        ...chartTheme.defaultOptions.scales!.x,
        beginAtZero: true,
        ticks: {
          ...chartTheme.defaultOptions.scales!.x!.ticks,
          callback: (value: number | string) => formatCurrency(Number(value)),
        },
      },
      y: {
        ...chartTheme.defaultOptions.scales!.y,
        ticks: {
          ...chartTheme.defaultOptions.scales!.y!.ticks,
          font: { size: 12, weight: 500 },
        },
      },
    },
  };

  return (
    <div
      className={`rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800 ${className} `}
      role="img"
      aria-label={`Spending by category chart with ${data.length} categories`}
    >
      <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Spending by Category
      </h3>
      <div style={{ height: Math.max(200, data.length * 50 + 50) }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
