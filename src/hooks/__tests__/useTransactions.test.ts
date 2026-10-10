import { renderHook, act, waitFor } from '@testing-library/react';
import { useTransactions } from '@/hooks/useTransactions';
import type { TransactionFormData, TransactionInput } from '@/lib/schemas';
import { vi } from 'vitest';

// Mock transactionDb
vi.mock('@/lib/db', () => ({
  transactionDb: {
    getAll: vi.fn(),
    getById: vi.fn(),
    getByCategoryId: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

import { transactionDb } from '@/lib/db';

type MockFn = ReturnType<typeof vi.fn>;

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

// Expected order after sorting by date descending (newest first)
const mockTransactionsSorted = [...mockTransactions].sort((a, b) => (b.date > a.date ? 1 : -1));

const validInput: TransactionInput = {
  amount: -50.0,
  categoryId: 'cat-1',
  date: '2024-01-25',
  note: 'Dinner',
};

const newTransaction: TransactionFormData = {
  id: 'txn-new',
  ...validInput,
  createdAt: '2024-01-25T18:00:00.000Z',
  updatedAt: '2024-01-25T18:00:00.000Z',
};

const updatedTransaction: TransactionFormData = {
  ...mockTransactions[0],
  amount: -30.0,
  note: 'Updated Lunch',
  updatedAt: '2024-01-15T13:00:00.000Z',
};

describe('useTransactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with empty transactions, loading true, and no error', () => {
    (transactionDb.getAll as MockFn).mockResolvedValue([]);

    const { result } = renderHook(() => useTransactions());

    expect(result.current.transactions).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('loads transactions on mount', async () => {
    (transactionDb.getAll as MockFn).mockResolvedValue(mockTransactions);

    const { result } = renderHook(() => useTransactions());

    // Initially loading
    expect(result.current.loading).toBe(true);

    // Wait for refresh to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.transactions).toEqual(mockTransactionsSorted);
    expect(result.current.error).toBeNull();
    expect(transactionDb.getAll).toHaveBeenCalledTimes(1);
  });

  it('sets error when loading fails', async () => {
    (transactionDb.getAll as MockFn).mockRejectedValue(new Error('DB error'));

    const { result } = renderHook(() => useTransactions());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('DB error');
    expect(result.current.transactions).toEqual([]);
  });

  it('sorts transactions by date descending on initial load', async () => {
    // Provide transactions in non-sorted order
    const unsortedTransactions = [
      mockTransactions[1], // Jan 10
      mockTransactions[2], // Jan 20
      mockTransactions[0], // Jan 15
    ];
    (transactionDb.getAll as MockFn).mockResolvedValue(unsortedTransactions);

    const { result } = renderHook(() => useTransactions());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should be sorted by date descending (newest first)
    expect(result.current.transactions).toEqual(mockTransactionsSorted);
  });

  it('adds a transaction successfully', async () => {
    (transactionDb.getAll as MockFn).mockResolvedValue(mockTransactions);
    (transactionDb.create as MockFn).mockResolvedValue(newTransaction);

    const { result } = renderHook(() => useTransactions());

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let addResult: TransactionFormData | null = null;
    await act(async () => {
      addResult = await result.current.addTransaction(validInput);
    });

    expect(addResult).toEqual(newTransaction);
    expect(transactionDb.create).toHaveBeenCalledWith(validInput);
    expect(result.current.transactions).toContainEqual(newTransaction);
    // Should be sorted with new transaction first (newest date)
    expect(result.current.transactions[0]).toEqual(newTransaction);
    expect(result.current.error).toBeNull();
  });

  it('adds transaction and sorts by date descending', async () => {
    (transactionDb.getAll as MockFn).mockResolvedValue(mockTransactions);
    const newerTransaction: TransactionFormData = {
      ...newTransaction,
      id: 'txn-newer',
      date: '2024-01-30', // Newer than existing
    };
    (transactionDb.create as MockFn).mockResolvedValue(newerTransaction);

    const { result } = renderHook(() => useTransactions());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.addTransaction({ ...validInput, date: '2024-01-30' });
    });

    // New transaction should be first (newest date)
    expect(result.current.transactions[0].id).toBe('txn-newer');
    expect(result.current.transactions[0].date).toBe('2024-01-30');
  });

  it('sets error when addTransaction fails', async () => {
    (transactionDb.getAll as MockFn).mockResolvedValue(mockTransactions);
    (transactionDb.create as MockFn).mockRejectedValue(new Error('Create failed'));

    const { result } = renderHook(() => useTransactions());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let addResult: TransactionFormData | null = null;
    await act(async () => {
      addResult = await result.current.addTransaction(validInput);
    });

    expect(addResult).toBeNull();
    expect(result.current.error).toBe('Create failed');
  });

  it('updates a transaction successfully', async () => {
    (transactionDb.getAll as MockFn).mockResolvedValue(mockTransactions);
    (transactionDb.update as MockFn).mockResolvedValue(updatedTransaction);

    const { result } = renderHook(() => useTransactions());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let updateResult: TransactionFormData | null = null;
    await act(async () => {
      updateResult = await result.current.updateTransaction('txn-1', {
        amount: -30.0,
        note: 'Updated Lunch',
      });
    });

    expect(updateResult).toEqual(updatedTransaction);
    expect(transactionDb.update).toHaveBeenCalledWith('txn-1', {
      amount: -30.0,
      note: 'Updated Lunch',
    });
    expect(result.current.transactions.find((t) => t.id === 'txn-1')).toEqual(updatedTransaction);
    expect(result.current.error).toBeNull();
  });

  it('updates transaction and re-sorts by date descending', async () => {
    (transactionDb.getAll as MockFn).mockResolvedValue(mockTransactions);
    const movedTransaction: TransactionFormData = {
      ...mockTransactions[0],
      date: '2024-01-30', // Move to newest
      updatedAt: '2024-01-15T13:00:00.000Z',
    };
    (transactionDb.update as MockFn).mockResolvedValue(movedTransaction);

    const { result } = renderHook(() => useTransactions());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.updateTransaction('txn-1', { date: '2024-01-30' });
    });

    // Updated transaction should be first (newest date)
    expect(result.current.transactions[0].id).toBe('txn-1');
    expect(result.current.transactions[0].date).toBe('2024-01-30');
  });

  it('returns null when updateTransaction fails (not found)', async () => {
    (transactionDb.getAll as MockFn).mockResolvedValue(mockTransactions);
    (transactionDb.update as MockFn).mockResolvedValue(null);

    const { result } = renderHook(() => useTransactions());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let updateResult: TransactionFormData | null = null;
    await act(async () => {
      updateResult = await result.current.updateTransaction('non-existent', { amount: -30.0 });
    });

    expect(updateResult).toBeNull();
    expect(result.current.transactions).toEqual(mockTransactionsSorted); // Unchanged
  });

  it('sets error when updateTransaction throws', async () => {
    (transactionDb.getAll as MockFn).mockResolvedValue(mockTransactions);
    (transactionDb.update as MockFn).mockRejectedValue(new Error('Update failed'));

    const { result } = renderHook(() => useTransactions());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let updateResult: TransactionFormData | null = null;
    await act(async () => {
      updateResult = await result.current.updateTransaction('txn-1', { amount: -30.0 });
    });

    expect(updateResult).toBeNull();
    expect(result.current.error).toBe('Update failed');
  });

  it('deletes a transaction successfully', async () => {
    (transactionDb.getAll as MockFn).mockResolvedValue(mockTransactions);
    (transactionDb.delete as MockFn).mockResolvedValue(true);

    const { result } = renderHook(() => useTransactions());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let deleteResult = false;
    await act(async () => {
      deleteResult = await result.current.deleteTransaction('txn-1');
    });

    expect(deleteResult).toBe(true);
    expect(transactionDb.delete).toHaveBeenCalledWith('txn-1');
    expect(result.current.transactions.find((t) => t.id === 'txn-1')).toBeUndefined();
    expect(result.current.transactions).toHaveLength(2);
    expect(result.current.error).toBeNull();
  });

  it('returns false when deleteTransaction fails (not found)', async () => {
    (transactionDb.getAll as MockFn).mockResolvedValue(mockTransactions);
    (transactionDb.delete as MockFn).mockResolvedValue(false);

    const { result } = renderHook(() => useTransactions());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let deleteResult = true;
    await act(async () => {
      deleteResult = await result.current.deleteTransaction('non-existent');
    });

    expect(deleteResult).toBe(false);
    expect(result.current.transactions).toHaveLength(3); // Unchanged
  });

  it('sets error when deleteTransaction throws', async () => {
    (transactionDb.getAll as MockFn).mockResolvedValue(mockTransactions);
    (transactionDb.delete as MockFn).mockRejectedValue(new Error('Delete failed'));

    const { result } = renderHook(() => useTransactions());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let deleteResult = true;
    await act(async () => {
      deleteResult = await result.current.deleteTransaction('txn-1');
    });

    expect(deleteResult).toBe(false);
    expect(result.current.error).toBe('Delete failed');
  });

  it('returns correct function references (stable across renders)', async () => {
    (transactionDb.getAll as MockFn).mockResolvedValue(mockTransactions);

    const { result, rerender } = renderHook(() => useTransactions());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const addFn = result.current.addTransaction;
    const updateFn = result.current.updateTransaction;
    const deleteFn = result.current.deleteTransaction;

    rerender();

    expect(result.current.addTransaction).toBe(addFn);
    expect(result.current.updateTransaction).toBe(updateFn);
    expect(result.current.deleteTransaction).toBe(deleteFn);
  });

  it('handles multiple rapid addTransaction calls', async () => {
    (transactionDb.getAll as MockFn).mockResolvedValue(mockTransactions);

    const txn1: TransactionFormData = { ...newTransaction, id: 'txn-1-new', date: '2024-01-25' };
    const txn2: TransactionFormData = { ...newTransaction, id: 'txn-2-new', date: '2024-01-26' };
    const txn3: TransactionFormData = { ...newTransaction, id: 'txn-3-new', date: '2024-01-27' };

    (transactionDb.create as MockFn)
      .mockResolvedValueOnce(txn1)
      .mockResolvedValueOnce(txn2)
      .mockResolvedValueOnce(txn3);

    const { result } = renderHook(() => useTransactions());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.addTransaction({ ...validInput, date: '2024-01-25' });
      await result.current.addTransaction({ ...validInput, date: '2024-01-26' });
      await result.current.addTransaction({ ...validInput, date: '2024-01-27' });
    });

    expect(result.current.transactions).toHaveLength(6);
    // Should be sorted by date descending (newest first)
    expect(result.current.transactions[0].id).toBe('txn-3-new');
    expect(result.current.transactions[1].id).toBe('txn-2-new');
    expect(result.current.transactions[2].id).toBe('txn-1-new');
  });

  it('does not call getAll multiple times on initial mount', async () => {
    (transactionDb.getAll as MockFn).mockResolvedValue(mockTransactions);

    renderHook(() => useTransactions());

    await waitFor(() => {
      expect(transactionDb.getAll).toHaveBeenCalledTimes(1);
    });

    // Advance timers to ensure no extra calls
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(transactionDb.getAll).toHaveBeenCalledTimes(1);
  });
});
