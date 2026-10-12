import type { ChartOptions } from 'chart.js';

/**
 * Shared Chart.js theme configuration for consistent styling across charts.
 * SSR-safe: only contains plain objects, no browser-specific code.
 */
export const chartTheme = {
  // Color palette for categorical data (category colors are used for bars)
  categoricalColors: [
    '#3b82f6', // blue
    '#22c55e', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#84cc16', // lime
    '#f97316', // orange
    '#6366f1', // indigo
  ],

  // Semantic colors
  incomeColor: '#22c55e', // green-500
  expenseColor: '#ef4444', // red-500
  neutralColor: '#6b7280', // gray-500

  // Default chart options
  defaultOptions: {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 300,
      easing: 'easeOutQuart',
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 17, 17, 0.9)',
        titleColor: '#fafafa',
        bodyColor: '#fafafa',
        borderColor: '#3f3f46',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        usePointStyle: true,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(113, 113, 122, 0.15)',
        },
        ticks: {
          color: '#71717a',
          font: { size: 11 },
          maxTicksLimit: 6,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#71717a',
          font: { size: 11 },
        },
      },
    },
  } satisfies ChartOptions<'bar'>,
};

/**
 * Format currency for tooltips and labels
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format percentage for tooltips
 */
export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%';
  return `${((value / total) * 100).toFixed(1)}%`;
}
