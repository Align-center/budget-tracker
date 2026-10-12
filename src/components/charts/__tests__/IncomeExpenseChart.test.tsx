import { render, screen } from '@testing-library/react';
import { IncomeExpenseChart } from '@/components/charts/IncomeExpenseChart';

describe('IncomeExpenseChart', () => {
  it('renders empty state when no data', () => {
    render(<IncomeExpenseChart income={0} expense={0} />);

    expect(screen.getByText('No income or expense data yet')).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'No income or expense data available' })
    ).toBeInTheDocument();
  });

  it('renders chart container with title when data exists', () => {
    render(<IncomeExpenseChart income={150} expense={70.5} />);

    expect(screen.getByText('Income vs Expense')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Income vs expense chart/ })).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    const { container } = render(
      <IncomeExpenseChart income={100} expense={50} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('matches snapshot with data', () => {
    const { container } = render(<IncomeExpenseChart income={150} expense={70.5} />);
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with empty data', () => {
    const { container } = render(<IncomeExpenseChart income={0} expense={0} />);
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with only income', () => {
    const { container } = render(<IncomeExpenseChart income={100} expense={0} />);
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with only expense', () => {
    const { container } = render(<IncomeExpenseChart income={0} expense={50} />);
    expect(container).toMatchSnapshot();
  });
});
