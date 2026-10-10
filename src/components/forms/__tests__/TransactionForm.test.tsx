import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionForm } from '@/components/forms/TransactionForm';
import type { TransactionInput } from '@/lib/schemas';
import { vi } from 'vitest';

// Mock useCategories hook
vi.mock('@/hooks/useCategories', () => ({
  useCategories: vi.fn(() => ({
    categories: [
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
    ],
    loading: false,
  })),
}));

const validTransactionInput: TransactionInput = {
  amount: -25.5,
  categoryId: 'cat-1',
  date: '2024-01-15',
  note: 'Lunch',
};

describe('TransactionForm', () => {
  let onSubmit: (data: TransactionInput) => Promise<void>;
  let onClose: () => void;

  beforeEach(() => {
    vi.clearAllMocks();
    onSubmit = vi.fn().mockResolvedValue(undefined);
    onClose = vi.fn();
  });

  const defaultProps = {
    get onSubmit() {
      return onSubmit;
    },
    get onClose() {
      return onClose;
    },
    isEditing: false,
  };

  it('renders form with empty fields when not editing', () => {
    render(<TransactionForm {...defaultProps} />);

    expect(screen.getByRole('heading', { name: 'Add Transaction' })).toBeInTheDocument();
    // valueAsNumber: true makes empty number input show as 0
    expect(screen.getByLabelText(/amount \*/i)).toHaveValue(0);
    expect(screen.getByRole('button', { name: /select category/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/date \*/i)).toBeInTheDocument();
  });

  it('renders form with prefilled data when editing', () => {
    render(<TransactionForm {...defaultProps} initialData={validTransactionInput} isEditing />);

    expect(screen.getByRole('heading', { name: 'Edit Transaction' })).toBeInTheDocument();
    // valueAsNumber converts to number, so the input shows as number
    expect(screen.getByLabelText(/amount \*/i)).toHaveValue(-25.5);
    expect(screen.getByLabelText(/note \(optional\)/i)).toHaveValue('Lunch');
  });

  it('shows default date as today when not editing', () => {
    const today = new Date().toISOString().split('T')[0];
    render(<TransactionForm {...defaultProps} />);

    expect(screen.getByLabelText(/date \*/i)).toHaveValue(today);
  });

  it('shows validation error for empty amount', async () => {
    render(<TransactionForm {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /create/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/amount must not be zero/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for zero amount', async () => {
    render(<TransactionForm {...defaultProps} />);

    const amountInput = screen.getByLabelText(/amount \*/i);
    fireEvent.change(amountInput, { target: { value: '0' } });

    const submitButton = screen.getByRole('button', { name: /create/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/amount must not be zero/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for empty category', async () => {
    render(<TransactionForm {...defaultProps} />);

    const amountInput = screen.getByLabelText(/amount \*/i);
    fireEvent.change(amountInput, { target: { value: '-25.50' } });

    const submitButton = screen.getByRole('button', { name: /create/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/category is required/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for future date', async () => {
    const user = userEvent.setup();
    render(<TransactionForm {...defaultProps} />);

    const amountInput = screen.getByLabelText(/amount \*/i);
    fireEvent.change(amountInput, { target: { value: '-25.50' } });

    // Select a category
    await user.click(screen.getByRole('button', { name: /select category/i }));
    await user.click(screen.getByRole('option', { name: 'Food' }));

    // Set future date - use a date far in the future to avoid timezone issues
    const futureDate = '2099-12-31';
    const dateInput = screen.getByLabelText(/date \*/i);
    await user.clear(dateInput);
    await user.type(dateInput, futureDate);

    const submitButton = screen.getByRole('button', { name: /create/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText((content) =>
          content.toLowerCase().includes('date cannot be in the future')
        )
      ).toBeInTheDocument();
    });
  });

  it('shows validation error for note too long', async () => {
    const user = userEvent.setup();
    render(<TransactionForm {...defaultProps} />);

    const amountInput = screen.getByLabelText(/amount \*/i);
    fireEvent.change(amountInput, { target: { value: '-25.50' } });

    // Select a category
    await user.click(screen.getByRole('button', { name: /select category/i }));
    await user.click(screen.getByRole('option', { name: 'Food' }));

    const noteInput = screen.getByLabelText(/note \(optional\)/i);
    await user.type(noteInput, 'a'.repeat(256));

    const submitButton = screen.getByRole('button', { name: /create/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/note is too long/i)).toBeInTheDocument();
    });
  }, 10000);

  it('submits valid form data (expense)', async () => {
    const user = userEvent.setup();
    render(<TransactionForm {...defaultProps} />);

    const amountInput = screen.getByLabelText(/amount \*/i);
    fireEvent.change(amountInput, { target: { value: '-25.50' } });

    // Select a category
    await user.click(screen.getByRole('button', { name: /select category/i }));
    await user.click(screen.getByRole('option', { name: 'Food' }));

    const noteInput = screen.getByLabelText(/note \(optional\)/i);
    await user.type(noteInput, 'Lunch');

    await user.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: -25.5,
          categoryId: 'cat-1',
          note: 'Lunch',
        })
      );
    });
  });

  it('submits valid form data (income)', async () => {
    const user = userEvent.setup();
    render(<TransactionForm {...defaultProps} />);

    const amountInput = screen.getByLabelText(/amount \*/i);
    fireEvent.change(amountInput, { target: { value: '100.00' } });

    // Select a category
    await user.click(screen.getByRole('button', { name: /select category/i }));
    await user.click(screen.getByRole('option', { name: 'Salary' }));

    await user.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 100.0,
          categoryId: 'cat-2',
        })
      );
    });
  });

  it('calls onClose when cancel button clicked', async () => {
    render(<TransactionForm {...defaultProps} />);

    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onClose when close button (X) clicked', async () => {
    render(<TransactionForm {...defaultProps} />);

    await userEvent.click(screen.getByRole('button', { name: /close/i }));

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('disables submit button while submitting', async () => {
    let resolveSubmit: (value: void) => void;
    const submitPromise = new Promise<void>((resolve) => {
      resolveSubmit = resolve;
    });
    const onSubmit = vi.fn(() => submitPromise);

    const user = userEvent.setup();
    render(<TransactionForm {...defaultProps} onSubmit={onSubmit} />);

    const amountInput = screen.getByLabelText(/amount \*/i);
    fireEvent.change(amountInput, { target: { value: '-25.50' } });

    // Select a category
    await user.click(screen.getByRole('button', { name: /select category/i }));
    await user.click(screen.getByRole('option', { name: 'Food' }));

    const submitButton = screen.getByRole('button', { name: /create/i });
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Saving...');

    await act(async () => {
      resolveSubmit!();
      await submitPromise;
    });

    expect(submitButton).not.toBeDisabled();
  });

  it('shows amount helper text', () => {
    render(<TransactionForm {...defaultProps} />);

    expect(screen.getByText(/positive = income, negative = expense/i)).toBeInTheDocument();
  });

  it('shows character count for note', async () => {
    const user = userEvent.setup();
    render(<TransactionForm {...defaultProps} />);

    const amountInput = screen.getByLabelText(/amount \*/i);
    fireEvent.change(amountInput, { target: { value: '-25.50' } });

    await user.click(screen.getByRole('button', { name: /select category/i }));
    await user.click(screen.getByRole('option', { name: 'Food' }));

    const noteInput = screen.getByLabelText(/note \(optional\)/i);
    await user.type(noteInput, 'Test');

    expect(screen.getByText('4/255')).toBeInTheDocument();
  });
});
