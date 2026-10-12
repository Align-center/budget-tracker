import type { ChartOptions } from 'chart.js';

/**
 * Shared Chart.js theme configuration for consistent styling across charts.
 * SSR-safe: only contains plain objects, no browser-specific code.
 */
export const chartTheme = {
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
  } satisfies ChartOptions,

  // Chart-specific overrides
  barOverrides: {
    indexAxis: 'y' as const,
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  } satisfies ChartOptions<'bar'>,

  doughnutOverrides: {
    cutout: '60%',
    plugins: {
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
    },
  } satisfies ChartOptions<'doughnut'>,

  // Constants extracted from magic numbers
  constants: {
    bar: {
      borderOpacity: 0.8,
      maxBarThickness: 40,
      minHeight: 200,
      heightPerItem: 50,
      heightPadding: 50,
      borderRadius: 6,
    },
    doughnut: {
      cutout: '60%',
      spacing: 2,
      height: 280,
    },
    centerText: {
      labelFont: '600 12px system-ui, -apple-system, sans-serif',
      valueFont: '700 20px system-ui, -apple-system, sans-serif',
      labelColor: '#71717a',
    },
  },
};

/**
 * Helper to apply opacity to a hex color
 * Returns hex color with alpha (e.g., #RRGGBB + 0.8 = #RRGGBBCC)
 */
export function withOpacity(hexColor: string, opacity: number): string {
  const cleanHex = hexColor.replace('#', '');
  const alphaHex = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase();
  return `#${cleanHex}${alphaHex}`;
}
