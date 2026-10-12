'use client';

import '@/components/charts/init';
import dynamic from 'next/dynamic';
import type { SpendingByCategoryItem } from '@/hooks/useReports';
import { chartTheme, withOpacity } from './chartTheme';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency } from '@/lib/utils';
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
      <EmptyState
        className={className}
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
        title="No spending data yet"
      />
    );
  }

  // Prepare chart data
  const labels = data.map((d) => d.categoryName);
  const amounts = data.map((d) => d.amount);
  const colors = data.map((d) => d.categoryColor);

  const { bar } = chartTheme.constants;

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Spending',
        data: amounts,
        backgroundColor: colors,
        borderColor: colors.map((c) => withOpacity(c, bar.borderOpacity)),
        borderWidth: 1,
        borderRadius: bar.borderRadius,
        borderSkipped: false,
        maxBarThickness: bar.maxBarThickness,
      },
    ],
  };

  const options = {
    ...chartTheme.defaultOptions,
    ...chartTheme.barOverrides,
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
      ...chartTheme.barOverrides.scales,
      x: {
        ...chartTheme.defaultOptions.scales!.x,
        ...chartTheme.barOverrides.scales!.x,
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

  const chartHeight = Math.max(bar.minHeight, data.length * bar.heightPerItem + bar.heightPadding);

  return (
    <div
      className={`rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800 ${className} `}
      role="img"
      aria-label={`Spending by category chart with ${data.length} categories`}
    >
      <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Spending by Category
      </h3>
      <div style={{ height: chartHeight }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
