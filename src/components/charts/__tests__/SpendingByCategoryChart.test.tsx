import { render, screen } from '@testing-library/react';
import { SpendingByCategoryChart } from '@/components/charts/SpendingByCategoryChart';
import type { SpendingByCategoryItem } from '@/hooks/useReports';

const mockData: SpendingByCategoryItem[] = [
  {
    categoryId: 'cat-1',
    categoryName: 'Food',
    categoryColor: '#ef4444',
    categoryIcon: '🍔',
    amount: 40.5,
  },
  {
    categoryId: 'cat-2',
    categoryName: 'Transport',
    categoryColor: '#3b82f6',
    categoryIcon: '🚌',
    amount: 30.0,
  },
  {
    categoryId: 'cat-3',
    categoryName: 'Entertainment',
    categoryColor: '#8b5cf6',
    categoryIcon: '🎮',
    amount: 15.0,
  },
];

describe('SpendingByCategoryChart', () => {
  it('renders empty state when no data', () => {
    render(<SpendingByCategoryChart data={[]} />);

    expect(screen.getByText('No spending data yet')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'No spending data available' })).toBeInTheDocument();
  });

  it('renders chart container with title when data exists', () => {
    render(<SpendingByCategoryChart data={mockData} />);

    expect(screen.getByText('Spending by Category')).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /Spending by category chart with 3 categories/ })
    ).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    const { container } = render(
      <SpendingByCategoryChart data={mockData} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('matches snapshot with data', () => {
    const { container } = render(<SpendingByCategoryChart data={mockData} />);
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with empty data', () => {
    const { container } = render(<SpendingByCategoryChart data={[]} />);
    expect(container).toMatchSnapshot();
  });
});
