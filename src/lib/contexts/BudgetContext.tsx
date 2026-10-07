'use client';

import { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';
import type { BudgetFormData, BudgetInput } from '@/lib/schemas';
import type { BudgetState, BudgetAction } from '@/lib/reducers/budget-reducer';
import { budgetReducer, initialBudgetState } from '@/lib/reducers/budget-reducer';
import { indexedDBBudgetRepository } from '@/lib/repositories/indexeddb';

/**
 * Budget Context for global budget state management
 */

interface BudgetContextValue {
  state: BudgetState;
  dispatch: Dispatch<BudgetAction>;
  /** Load all budgets from repository */
  loadBudgets: () => Promise<void>;
  /** Load budgets for a specific month */
  loadBudgetsByMonth: (month: string) => Promise<void>;
  /** Add a new budget */
  addBudget: (input: BudgetInput) => Promise<BudgetFormData>;
  /** Update an existing budget */
  updateBudget: (id: string, input: Partial<BudgetInput>) => Promise<BudgetFormData>;
  /** Delete a budget */
  deleteBudget: (id: string) => Promise<void>;
}

const BudgetContext = createContext<BudgetContextValue | null>(null);

interface BudgetProviderProps {
  children: ReactNode;
}

export function BudgetProvider({ children }: BudgetProviderProps) {
  const [state, dispatch] = useReducer(budgetReducer, initialBudgetState);

  const loadBudgets = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const budgets = await indexedDBBudgetRepository.getAll();
      dispatch({ type: 'SET_ALL', payload: budgets });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to load budgets',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadBudgetsByMonth = async (month: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const budgets = await indexedDBBudgetRepository.getByMonth(month);
      dispatch({ type: 'SET_ALL', payload: budgets });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to load budgets',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addBudget = async (input: BudgetInput): Promise<BudgetFormData> => {
    const budget = await indexedDBBudgetRepository.create(input);
    dispatch({ type: 'ADD', payload: budget });
    return budget;
  };

  const updateBudget = async (id: string, input: Partial<BudgetInput>): Promise<BudgetFormData> => {
    const budget = await indexedDBBudgetRepository.update(id, input);
    dispatch({ type: 'UPDATE', payload: budget });
    return budget;
  };

  const deleteBudget = async (id: string): Promise<void> => {
    await indexedDBBudgetRepository.delete(id);
    dispatch({ type: 'DELETE', payload: id });
  };

  return (
    <BudgetContext.Provider
      value={{
        state,
        dispatch,
        loadBudgets,
        loadBudgetsByMonth,
        addBudget,
        updateBudget,
        deleteBudget,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudgets(): BudgetContextValue {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudgets must be used within a BudgetProvider');
  }
  return context;
}
