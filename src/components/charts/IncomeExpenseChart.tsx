'use client';

import dynamic from 'next/dynamic';
import { chartTheme, formatCurrency, formatPercentage } from './chartTheme';
import type { TooltipItem } from 'chart.js';

// SSR-safe dynamic import for Chart.js components
const Doughnut = dynamic(() => import('react-chartjs-2').then((mod) => mod.Doughnut), {
  ssr: false,
});

interface IncomeExpenseChartProps {
  income: number;
  expense: number;
  className?: string;
}

export type { IncomeExpenseChartProps };

/**
 * Doughnut chart showing income vs expense.
 * - 2 segments: green (#22c55e) income, red (#ef4444) expense
 * - Cutout 60%
 * - Center label "Balance: $X.XX"
 * - Legend bottom
 * - Tooltips with amount + percentage
 */
export function IncomeExpenseChart({ income, expense, className = '' }: IncomeExpenseChartProps) {
  const total = income + expense;
  const balance = income - expense;
  const hasData = total > 0;

  if (!hasData) {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-12 dark:border-zinc-700 dark:bg-zinc-800 ${className} `}
        role="img"
        aria-label="No income or expense data available"
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
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-center text-zinc-500 dark:text-zinc-400">
          No income or expense data yet
        </p>
      </div>
    );
  }

  const chartData = {
    labels: ['Income', 'Expense'],
    datasets: [
      {
        data: [income, expense],
        backgroundColor: [chartTheme.incomeColor, chartTheme.expenseColor],
        borderColor: ['transparent', 'transparent'],
        borderWidth: 0,
        cutout: '60%',
        spacing: 2,
      },
    ],
  };

  const options = {
    ...chartTheme.defaultOptions,
    cutout: '60%',
    plugins: {
      ...chartTheme.defaultOptions.plugins,
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          color: '#71717a',
          font: { size: 12 },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        ...chartTheme.defaultOptions.plugins!.tooltip,
        callbacks: {
          label: (context: TooltipItem<'doughnut'>) => {
            const value = context.parsed ?? 0;
            const label = context.label ?? '';
            const pct = formatPercentage(value, total);
            return `${label}: ${formatCurrency(value)} (${pct})`;
          },
        },
      },
    },
  };

  // Custom plugin for center label
  const centerTextPlugin = {
    id: 'centerText',
    afterDraw: (chart: {
      ctx: CanvasRenderingContext2D;
      chartArea: { left: number; right: number; top: number; bottom: number };
    }) => {
      const { ctx, chartArea } = chart;
      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Balance label
      ctx.font = '600 12px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#71717a';
      ctx.fillText('Balance', centerX, centerY - 10);

      // Balance amount
      const isPositive = balance >= 0;
      ctx.font = '700 20px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = isPositive ? chartTheme.incomeColor : chartTheme.expenseColor;
      ctx.fillText(formatCurrency(balance), centerX, centerY + 14);

      ctx.restore();
    },
  };

  return (
    <div
      className={`rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800 ${className} `}
      role="img"
      aria-label={`Income vs expense chart. Income: ${formatCurrency(income)}, Expense: ${formatCurrency(expense)}, Balance: ${formatCurrency(balance)}`}
    >
      <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Income vs Expense
      </h3>
      <div style={{ height: 280, position: 'relative' }}>
        <Doughnut data={chartData} options={options} plugins={[centerTextPlugin]} />
      </div>
    </div>
  );
}
