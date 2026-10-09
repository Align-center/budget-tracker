import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoryForm } from '@/components/forms/CategoryForm';
import type { CategoryInput } from '@/lib/schemas';
import { vi } from 'vitest';

const defaultProps = {
  onSubmit: vi.fn(),
  onClose: vi.fn(),
  isEditing: false,
};

const validCategoryInput: CategoryInput = {
  name: 'Food',
  icon: 'Utensils',
  color: '#FF5733',
};

describe('CategoryForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form with empty fields when not editing', () => {
    render(<CategoryForm {...defaultProps} />);

    expect(screen.getByRole('heading', { name: 'Add Category' })).toBeInTheDocument();
    expect(screen.getByLabelText(/name \*/i)).toHaveValue('');
    expect(screen.getByRole('button', { name: /select icon/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/pick a color/i)).toBeInTheDocument();
  });

  it('renders form with prefilled data when editing', () => {
    render(<CategoryForm {...defaultProps} initialData={validCategoryInput} isEditing />);

    expect(screen.getByRole('heading', { name: 'Edit Category' })).toBeInTheDocument();
    expect(screen.getByLabelText(/name \*/i)).toHaveValue('Food');
  });

  it('shows validation error for empty name', async () => {
    render(<CategoryForm {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /create/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for name too long', async () => {
    render(<CategoryForm {...defaultProps} />);

    const nameInput = screen.getByLabelText(/name \*/i);
    fireEvent.change(nameInput, { target: { value: 'a'.repeat(101) } });

    const submitButton = screen.getByRole('button', { name: /create/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is too long/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for empty icon', async () => {
    render(<CategoryForm {...defaultProps} />);

    const nameInput = screen.getByLabelText(/name \*/i);
    fireEvent.change(nameInput, { target: { value: 'Food' } });

    const submitButton = screen.getByRole('button', { name: /create/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/icon is required/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid hex color', async () => {
    const user = userEvent.setup();
    render(<CategoryForm {...defaultProps} />);

    await user.type(screen.getByLabelText(/name \*/i), 'Food');

    // Need to select an icon first
    await user.click(screen.getByRole('button', { name: /select icon/i }));
    await user.click(screen.getByRole('option', { name: 'Utensils' }));

    // Target the hex text input (not the color picker)
    const colorInput = screen.getByPlaceholderText(/#3B82F6/i);
    await user.type(colorInput, '{selectAll}invalid');

    const submitButton = screen.getByRole('button', { name: /create/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText((content) => content.includes('Color must be a valid hex color'))
      ).toBeInTheDocument();
    });
  });

  it('submits valid form data', async () => {
    const user = userEvent.setup();
    render(<CategoryForm {...defaultProps} />);

    await user.type(screen.getByLabelText(/name \*/i), 'Food');

    // Open icon picker and select an icon
    await user.click(screen.getByRole('button', { name: /select icon/i }));
    await user.click(screen.getByRole('option', { name: 'Utensils' }));

    // Set color via color picker (input type=color)
    const colorInput = screen.getByLabelText(/pick a color/i);
    fireEvent.change(colorInput, { target: { value: '#FF5733' } });

    await user.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Food',
          icon: 'Utensils',
          color: '#ff5733',
        })
      );
    });
  });

  it('calls onClose when cancel button clicked', async () => {
    render(<CategoryForm {...defaultProps} />);

    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onClose when close button (X) clicked', async () => {
    render(<CategoryForm {...defaultProps} />);

    await userEvent.click(screen.getByRole('button', { name: /close/i }));

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('disables submit button while submitting', async () => {
    let resolveSubmit: (value: void) => void;
    const submitPromise = new Promise<void>((resolve) => {
      resolveSubmit = resolve;
    });
    const onSubmit = vi.fn(() => submitPromise);

    render(<CategoryForm {...defaultProps} onSubmit={onSubmit} />);

    const nameInput = screen.getByLabelText(/name \*/i);
    fireEvent.change(nameInput, { target: { value: 'Food' } });

    // Need to select an icon first
    const iconButton = screen.getByRole('button', { name: /select icon/i });
    fireEvent.click(iconButton);
    const utensilsOption = screen.getByRole('option', { name: 'Utensils' });
    fireEvent.click(utensilsOption);

    const colorInput = screen.getByLabelText(/pick a color/i);
    fireEvent.change(colorInput, { target: { value: '#FF5733' } });

    const submitButton = screen.getByRole('button', { name: /create/i });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Saving...');

    await act(async () => {
      resolveSubmit!();
      await submitPromise;
    });

    expect(submitButton).not.toBeDisabled();
  });
});
