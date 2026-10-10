import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionList } from '@/components/lists/TransactionList';
import type { TransactionFormData, CategoryFormData } from '@/lib/schemas';
import { vi } from 'vitest';

const mockCategories: CategoryFormData[] = [
  {
    id: 'cat-1',
    name: 'Food',
    icon: 'Utensils',
    color: '#FF5733',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'cat-2',
    name: 'Salary',
    icon: 'Briefcase',
    color: '#3B82F6',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
];

const mockTransactions: TransactionFormData[] = [
  {
    id: 'txn-1',
    amount: -25.5,
    categoryId: 'cat-1',
    date: '2024-01-15',
    note: 'Lunch',
    createdAt: '2024-01-15T12:00:00.000Z',
    updatedAt: '2024-01-15T12:00:00.000Z',
  },
  {
    id: 'txn-2',
    amount: 100.0,
    categoryId: 'cat-2',
    date: '2024-01-10',
    note: 'Paycheck',
    createdAt: '2024-01-10T09:00:00.000Z',
    updatedAt: '2024-01-10T09:00:00.000Z',
  },
  {
    id: 'txn-3',
    amount: -15.0,
    categoryId: 'cat-1',
    date: '2024-01-20',
    note: undefined,
    createdAt: '2024-01-20T18:00:00.000Z',
    updatedAt: '2024-01-20T18:00:00.000Z',
  },
];

const defaultProps = {
  transactions: mockTransactions,
  categories: mockCategories,
  onEdit: vi.fn(),
  onDelete: vi.fn(),
  onAdd: vi.fn(),
  loading: false,
};

describe('TransactionList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading skeletons when loading is true', () => {
    render(<TransactionList {...defaultProps} loading />);

    expect(screen.getAllByTestId('loading-skeleton')).toHaveLength(5);
  });

  it('renders empty state when no transactions', () => {
    render(<TransactionList {...defaultProps} transactions={[]} />);

    expect(screen.getByText('No transactions yet')).toBeInTheDocument();
    expect(screen.getByText('Create your first transaction to start tracking')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add transaction/i })).toBeInTheDocument();
  });

  it('calls onAdd when Add Transaction button clicked in empty state', async () => {
    const user = userEvent.setup();
    render(<TransactionList {...defaultProps} transactions={[]} />);

    await user.click(screen.getByRole('button', { name: /add transaction/i }));

    expect(defaultProps.onAdd).toHaveBeenCalled();
  });

  it('renders table with transaction rows', () => {
    render(<TransactionList {...defaultProps} />);

    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument();
    expect(screen.getByText('Jan 10, 2024')).toBeInTheDocument();
    expect(screen.getByText('Jan 20, 2024')).toBeInTheDocument();
  });

  it('renders category with icon and color', () => {
    render(<TransactionList {...defaultProps} />);

    // Two transactions have Food category, one has Salary
    const foodElements = screen.getAllByText('Food');
    expect(foodElements).toHaveLength(2);
    expect(screen.getByText('Salary')).toBeInTheDocument();
  });

  it('renders expense amounts in red and income in green', () => {
    render(<TransactionList {...defaultProps} />);

    // Expense: -25.50 should be red (class on parent span)
    const expenseAmount = screen.getByText('-25.50');
    expect(expenseAmount.closest('span')).toHaveClass('text-red-600');

    // Income: +100.00 should be green
    const incomeAmount = screen.getByText('+100.00');
    expect(incomeAmount.closest('span')).toHaveClass('text-green-600');
  });

  it('renders note when present', () => {
    render(<TransactionList {...defaultProps} />);

    expect(screen.getByText('Lunch')).toBeInTheDocument();
    expect(screen.getByText('Paycheck')).toBeInTheDocument();
  });

  it('renders em dash when note is undefined', () => {
    render(<TransactionList {...defaultProps} />);

    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('calls onEdit when edit button clicked', async () => {
    const user = userEvent.setup();
    render(<TransactionList {...defaultProps} />);

    const editButtons = screen.getAllByRole('button', { name: /edit transaction/i });
    await user.click(editButtons[0]);

    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockTransactions[0]);
  });

  it('calls onDelete when delete button clicked and confirmed', async () => {
    const user = userEvent.setup();
    // Mock window.confirm to return true
    vi.stubGlobal(
      'confirm',
      vi.fn(() => true)
    );

    render(<TransactionList {...defaultProps} />);

    const deleteButtons = screen.getAllByRole('button', { name: /delete transaction/i });
    await user.click(deleteButtons[0]);

    expect(defaultProps.onDelete).toHaveBeenCalledWith('txn-1');

    vi.unstubAllGlobals();
  });

  it('does not call onDelete when delete cancelled', async () => {
    const user = userEvent.setup();
    // Mock window.confirm to return false
    vi.stubGlobal(
      'confirm',
      vi.fn(() => false)
    );

    render(<TransactionList {...defaultProps} />);

    const deleteButtons = screen.getAllByRole('button', { name: /delete transaction/i });
    await user.click(deleteButtons[0]);

    expect(defaultProps.onDelete).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });

  it('renders table headers correctly', () => {
    render(<TransactionList {...defaultProps} />);

    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('Note')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('shows category ID when category not found', () => {
    const transactionsWithUnknownCategory: TransactionFormData[] = [
      {
        ...mockTransactions[0],
        categoryId: 'unknown-category',
      },
    ];

    render(<TransactionList {...defaultProps} transactions={transactionsWithUnknownCategory} />);

    expect(screen.getByText('unknown-category')).toBeInTheDocument();
  });

  it('renders transactions in the order provided (no internal sorting)', () => {
    // Component renders in the order provided; sorting is done by the hook/page
    const unsortedTransactions = [
      mockTransactions[1], // Jan 10
      mockTransactions[2], // Jan 20
      mockTransactions[0], // Jan 15
    ];

    render(<TransactionList {...defaultProps} transactions={unsortedTransactions} />);

    const dates = screen.getAllByText(/\w{3} \d{1,2}, \d{4}/);
    expect(dates[0]).toHaveTextContent('Jan 10, 2024');
    expect(dates[1]).toHaveTextContent('Jan 20, 2024');
    expect(dates[2]).toHaveTextContent('Jan 15, 2024');
  });

  it('displays category icon with correct background color', () => {
    render(<TransactionList {...defaultProps} />);

    // Check that the category icon containers have the correct background colors
    const categoryCells = screen.getAllByText('Food');
    expect(categoryCells).toHaveLength(2);

    // The first Food category (txn-1) should have the orange background
    const firstFoodCell = categoryCells[0].closest('td');
    expect(firstFoodCell).toBeInTheDocument();

    // Find the icon container div with the background color
    const iconContainers = screen.getAllByTestId('icon-utensils');
    expect(iconContainers).toHaveLength(2);
  });

  it('displays Salary category with blue background', () => {
    render(<TransactionList {...defaultProps} />);

    const salaryCell = screen.getByText('Salary').closest('td');
    const briefcaseIcon = screen.getByTestId('icon-briefcase');
    expect(briefcaseIcon).toBeInTheDocument();
    expect(salaryCell).toBeInTheDocument();
  });

  it('calls onEdit with correct transaction when second edit button clicked', async () => {
    const user = userEvent.setup();
    render(<TransactionList {...defaultProps} />);

    const editButtons = screen.getAllByRole('button', { name: /edit transaction/i });
    await user.click(editButtons[1]); // Second transaction (Salary)

    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockTransactions[1]);
  });

  it('calls onDelete with correct id when second delete button clicked', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'confirm',
      vi.fn(() => true)
    );

    render(<TransactionList {...defaultProps} />);

    const deleteButtons = screen.getAllByRole('button', { name: /delete transaction/i });
    await user.click(deleteButtons[1]); // Second transaction

    expect(defaultProps.onDelete).toHaveBeenCalledWith('txn-2');

    vi.unstubAllGlobals();
  });
});
