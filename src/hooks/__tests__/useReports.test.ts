import { renderHook } from '@testing-library/react';
import { useReports } from '@/hooks/useReports';
import type { TransactionFormData, CategoryFormData } from '@/lib/schemas';
import { vi } from 'vitest';

// Mock the hooks that useReports depends on
vi.mock('@/hooks/useTransactions', () => ({
  useTransactions: vi.fn(),
}));

vi.mock('@/hooks/useCategories', () => ({
  useCategories: vi.fn(),
}));

import { useTransactions } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';

type MockFn = ReturnType<typeof vi.fn>;

const mockCategories: CategoryFormData[] = [
  {
    id: 'cat-1',
    name: 'Food',
    icon: '🍔',
    color: '#ef4444',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'cat-2',
    name: 'Salary',
    icon: '💰',
    color: '#22c55e',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'cat-3',
    name: 'Transport',
    icon: '🚌',
    color: '#3b82f6',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
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
    note: 'Coffee',
    createdAt: '2024-01-20T18:00:00.000Z',
    updatedAt: '2024-01-20T18:00:00.000Z',
  },
  {
    id: 'txn-4',
    amount: -30.0,
    categoryId: 'cat-3',
    date: '2024-01-25',
    note: 'Bus pass',
    createdAt: '2024-01-25T10:00:00.000Z',
    updatedAt: '2024-01-25T10:00:00.000Z',
  },
  {
    id: 'txn-5',
    amount: 50.0,
    categoryId: 'cat-2',
    date: '2024-01-28',
    note: 'Freelance',
    createdAt: '2024-01-28T14:00:00.000Z',
    updatedAt: '2024-01-28T14:00:00.000Z',
  },
];

describe('useReports', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns loading true initially', () => {
    (useTransactions as MockFn).mockReturnValue({
      transactions: [],
      loading: true,
      error: null,
      addTransaction: vi.fn(),
      updateTransaction: vi.fn(),
      deleteTransaction: vi.fn(),
    });
    (useCategories as MockFn).mockReturnValue({
      categories: [],
      loading: true,
      error: null,
      addCategory: vi.fn(),
      updateCategory: vi.fn(),
      deleteCategory: vi.fn(),
      refreshCategories: vi.fn(),
      checkNameUnique: vi.fn(),
    });

    const { result } = renderHook(() => useReports());

    expect(result.current.loading).toBe(true);
    expect(result.current.spendingByCategory).toEqual([]);
    expect(result.current.incomeVsExpense).toEqual({ income: 0, expense: 0, balance: 0 });
  });

  it('derives spendingByCategory correctly from transactions and categories', () => {
    (useTransactions as MockFn).mockReturnValue({
      transactions: mockTransactions,
      loading: false,
      error: null,
      addTransaction: vi.fn(),
      updateTransaction: vi.fn(),
      deleteTransaction: vi.fn(),
    });
    (useCategories as MockFn).mockReturnValue({
      categories: mockCategories,
      loading: false,
      error: null,
      addCategory: vi.fn(),
      updateCategory: vi.fn(),
      deleteCategory: vi.fn(),
      refreshCategories: vi.fn(),
      checkNameUnique: vi.fn(),
    });

    const { result } = renderHook(() => useReports());

    expect(result.current.loading).toBe(false);
    expect(result.current.spendingByCategory).toHaveLength(2);

    // Food (cat-1): 25.5 + 15.0 = 40.5
    const food = result.current.spendingByCategory.find((c) => c.categoryId === 'cat-1');
    expect(food).toBeDefined();
    expect(food!.categoryName).toBe('Food');
    expect(food!.categoryColor).toBe('#ef4444');
    expect(food!.categoryIcon).toBe('🍔');
    expect(food!.amount).toBe(40.5);

    // Transport (cat-3): 30.0
    const transport = result.current.spendingByCategory.find((c) => c.categoryId === 'cat-3');
    expect(transport).toBeDefined();
    expect(transport!.categoryName).toBe('Transport');
    expect(transport!.amount).toBe(30.0);

    // Sorted by amount descending (Food first, then Transport)
    expect(result.current.spendingByCategory[0].categoryId).toBe('cat-1');
    expect(result.current.spendingByCategory[1].categoryId).toBe('cat-3');
  });

  it('derives incomeVsExpense correctly', () => {
    (useTransactions as MockFn).mockReturnValue({
      transactions: mockTransactions,
      loading: false,
      error: null,
      addTransaction: vi.fn(),
      updateTransaction: vi.fn(),
      deleteTransaction: vi.fn(),
    });
    (useCategories as MockFn).mockReturnValue({
      categories: mockCategories,
      loading: false,
      error: null,
      addCategory: vi.fn(),
      updateCategory: vi.fn(),
      deleteCategory: vi.fn(),
      refreshCategories: vi.fn(),
      checkNameUnique: vi.fn(),
    });

    const { result } = renderHook(() => useReports());

    // Income: 100 + 50 = 150
    // Expense: 25.5 + 15 + 30 = 70.5
    // Balance: 150 - 70.5 = 79.5
    expect(result.current.incomeVsExpense).toEqual({
      income: 150,
      expense: 70.5,
      balance: 79.5,
    });
  });

  it('handles transactions with unknown categories', () => {
    const transactionsWithUnknown: TransactionFormData[] = [
      {
        id: 'txn-1',
        amount: -25.0,
        categoryId: 'unknown-cat',
        date: '2024-01-15',
        note: 'Lunch',
        createdAt: '2024-01-15T12:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      },
    ];

    (useTransactions as MockFn).mockReturnValue({
      transactions: transactionsWithUnknown,
      loading: false,
      error: null,
      addTransaction: vi.fn(),
      updateTransaction: vi.fn(),
      deleteTransaction: vi.fn(),
    });
    (useCategories as MockFn).mockReturnValue({
      categories: mockCategories,
      loading: false,
      error: null,
      addCategory: vi.fn(),
      updateCategory: vi.fn(),
      deleteCategory: vi.fn(),
      refreshCategories: vi.fn(),
      checkNameUnique: vi.fn(),
    });

    const { result } = renderHook(() => useReports());

    expect(result.current.spendingByCategory).toHaveLength(1);
    const unknown = result.current.spendingByCategory[0];
    expect(unknown.categoryId).toBe('unknown-cat');
    expect(unknown.categoryName).toBe('Unknown');
    expect(unknown.categoryColor).toBe('#6b7280'); // neutral color
    expect(unknown.categoryIcon).toBe('📦');
    expect(unknown.amount).toBe(25.0);
  });

  it('handles only income transactions (no expenses)', () => {
    const incomeOnly: TransactionFormData[] = [
      {
        id: 'txn-1',
        amount: 100.0,
        categoryId: 'cat-2',
        date: '2024-01-10',
        note: 'Paycheck',
        createdAt: '2024-01-10T09:00:00.000Z',
        updatedAt: '2024-01-10T09:00:00.000Z',
      },
      {
        id: 'txn-2',
        amount: 50.0,
        categoryId: 'cat-2',
        date: '2024-01-28',
        note: 'Freelance',
        createdAt: '2024-01-28T14:00:00.000Z',
        updatedAt: '2024-01-28T14:00:00.000Z',
      },
    ];

    (useTransactions as MockFn).mockReturnValue({
      transactions: incomeOnly,
      loading: false,
      error: null,
      addTransaction: vi.fn(),
      updateTransaction: vi.fn(),
      deleteTransaction: vi.fn(),
    });
    (useCategories as MockFn).mockReturnValue({
      categories: mockCategories,
      loading: false,
      error: null,
      addCategory: vi.fn(),
      updateCategory: vi.fn(),
      deleteCategory: vi.fn(),
      refreshCategories: vi.fn(),
      checkNameUnique: vi.fn(),
    });

    const { result } = renderHook(() => useReports());

    expect(result.current.spendingByCategory).toEqual([]);
    expect(result.current.incomeVsExpense).toEqual({
      income: 150,
      expense: 0,
      balance: 150,
    });
  });

  it('handles only expense transactions (no income)', () => {
    const expenseOnly: TransactionFormData[] = [
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
        amount: -15.0,
        categoryId: 'cat-1',
        date: '2024-01-20',
        note: 'Coffee',
        createdAt: '2024-01-20T18:00:00.000Z',
        updatedAt: '2024-01-20T18:00:00.000Z',
      },
    ];

    (useTransactions as MockFn).mockReturnValue({
      transactions: expenseOnly,
      loading: false,
      error: null,
      addTransaction: vi.fn(),
      updateTransaction: vi.fn(),
      deleteTransaction: vi.fn(),
    });
    (useCategories as MockFn).mockReturnValue({
      categories: mockCategories,
      loading: false,
      error: null,
      addCategory: vi.fn(),
      updateCategory: vi.fn(),
      deleteCategory: vi.fn(),
      refreshCategories: vi.fn(),
      checkNameUnique: vi.fn(),
    });

    const { result } = renderHook(() => useReports());

    expect(result.current.spendingByCategory).toHaveLength(1);
    expect(result.current.spendingByCategory[0].amount).toBe(40.5);
    expect(result.current.incomeVsExpense).toEqual({
      income: 0,
      expense: 40.5,
      balance: -40.5,
    });
  });

  it('returns error from transactions hook', () => {
    (useTransactions as MockFn).mockReturnValue({
      transactions: [],
      loading: false,
      error: 'Failed to load transactions',
      addTransaction: vi.fn(),
      updateTransaction: vi.fn(),
      deleteTransaction: vi.fn(),
    });
    (useCategories as MockFn).mockReturnValue({
      categories: [],
      loading: false,
      error: null,
      addCategory: vi.fn(),
      updateCategory: vi.fn(),
      deleteCategory: vi.fn(),
      refreshCategories: vi.fn(),
      checkNameUnique: vi.fn(),
    });

    const { result } = renderHook(() => useReports());

    expect(result.current.error).toBe('Failed to load transactions');
  });

  it('memoizes spendingByCategory - returns same reference when inputs unchanged', () => {
    (useTransactions as MockFn).mockReturnValue({
      transactions: mockTransactions,
      loading: false,
      error: null,
      addTransaction: vi.fn(),
      updateTransaction: vi.fn(),
      deleteTransaction: vi.fn(),
    });
    (useCategories as MockFn).mockReturnValue({
      categories: mockCategories,
      loading: false,
      error: null,
      addCategory: vi.fn(),
      updateCategory: vi.fn(),
      deleteCategory: vi.fn(),
      refreshCategories: vi.fn(),
      checkNameUnique: vi.fn(),
    });

    const { result, rerender } = renderHook(() => useReports());

    const firstRender = result.current.spendingByCategory;
    rerender();
    const secondRender = result.current.spendingByCategory;

    expect(firstRender).toBe(secondRender); // Same reference due to useMemo
  });

  it('memoizes incomeVsExpense - returns same reference when inputs unchanged', () => {
    (useTransactions as MockFn).mockReturnValue({
      transactions: mockTransactions,
      loading: false,
      error: null,
      addTransaction: vi.fn(),
      updateTransaction: vi.fn(),
      deleteTransaction: vi.fn(),
    });
    (useCategories as MockFn).mockReturnValue({
      categories: mockCategories,
      loading: false,
      error: null,
      addCategory: vi.fn(),
      updateCategory: vi.fn(),
      deleteCategory: vi.fn(),
      refreshCategories: vi.fn(),
      checkNameUnique: vi.fn(),
    });

    const { result, rerender } = renderHook(() => useReports());

    const firstRender = result.current.incomeVsExpense;
    rerender();
    const secondRender = result.current.incomeVsExpense;

    expect(firstRender).toBe(secondRender); // Same reference due to useMemo
  });

  it('handles empty transactions and categories', () => {
    (useTransactions as MockFn).mockReturnValue({
      transactions: [],
      loading: false,
      error: null,
      addTransaction: vi.fn(),
      updateTransaction: vi.fn(),
      deleteTransaction: vi.fn(),
    });
    (useCategories as MockFn).mockReturnValue({
      categories: [],
      loading: false,
      error: null,
      addCategory: vi.fn(),
      updateCategory: vi.fn(),
      deleteCategory: vi.fn(),
      refreshCategories: vi.fn(),
      checkNameUnique: vi.fn(),
    });

    const { result } = renderHook(() => useReports());

    expect(result.current.spendingByCategory).toEqual([]);
    expect(result.current.incomeVsExpense).toEqual({ income: 0, expense: 0, balance: 0 });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
