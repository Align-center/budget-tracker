import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoryList } from '@/components/lists/CategoryList';
import type { CategoryFormData } from '@/lib/schemas';
import { vi } from 'vitest';

const mockCategories: CategoryFormData[] = [
  {
    id: '1',
    name: 'Food',
    icon: 'Utensils',
    color: '#FF5733',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Salary',
    icon: 'Briefcase',
    color: '#3B82F6',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
];

const defaultProps = {
  categories: mockCategories,
  onEdit: vi.fn(),
  onDelete: vi.fn(),
  onAdd: vi.fn(),
  loading: false,
};

describe('CategoryList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading skeleton when loading', () => {
    render(<CategoryList {...defaultProps} loading={true} />);

    const skeletons = screen.getAllByTestId(/loading-skeleton/i);
    expect(skeletons).toHaveLength(5);
  });

  it('renders empty state when no categories', () => {
    render(<CategoryList {...defaultProps} categories={[]} />);

    expect(screen.getByText(/no categories yet/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add category/i })).toBeInTheDocument();
  });

  it('calls onAdd when Add Category button clicked in empty state', async () => {
    render(<CategoryList {...defaultProps} categories={[]} />);

    await userEvent.click(screen.getByRole('button', { name: /add category/i }));

    expect(defaultProps.onAdd).toHaveBeenCalled();
  });

  it('renders list of categories', () => {
    render(<CategoryList {...defaultProps} />);

    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('Salary')).toBeInTheDocument();
    expect(screen.getByText('#FF5733')).toBeInTheDocument();
    expect(screen.getByText('#3B82F6')).toBeInTheDocument();
  });

  it('shows colored icon for each category', () => {
    render(<CategoryList {...defaultProps} />);

    const foodIcon = screen.getByTestId('icon-utensils');
    const salaryIcon = screen.getByTestId('icon-briefcase');

    expect(foodIcon).toBeInTheDocument();
    expect(salaryIcon).toBeInTheDocument();
  });

  it('calls onEdit when edit button clicked', async () => {
    render(<CategoryList {...defaultProps} />);

    const editButtons = screen.getAllByRole('button', { name: /edit category/i });
    await userEvent.click(editButtons[0]);

    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockCategories[0]);
  });

  it('calls onDelete when delete button clicked and confirmed', async () => {
    window.confirm = vi.fn(() => true);
    render(<CategoryList {...defaultProps} />);

    const deleteButtons = screen.getAllByRole('button', { name: /delete category/i });
    await userEvent.click(deleteButtons[0]);

    expect(defaultProps.onDelete).toHaveBeenCalledWith('1');
  });

  it('does not call onDelete when delete cancelled', async () => {
    window.confirm = vi.fn(() => false);
    render(<CategoryList {...defaultProps} />);

    const deleteButtons = screen.getAllByRole('button', { name: /delete category/i });
    await userEvent.click(deleteButtons[0]);

    expect(defaultProps.onDelete).not.toHaveBeenCalled();
  });
});
