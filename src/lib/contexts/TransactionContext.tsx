'use client';

import { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';
import type { TransactionFormData, TransactionInput } from '@/lib/schemas';
import type { TransactionState, TransactionAction } from '@/lib/reducers/transaction-reducer';
import { transactionReducer, initialTransactionState } from '@/lib/reducers/transaction-reducer';
import { indexedDBTransactionRepository } from '@/lib/repositories/indexeddb';

/**
 * Transaction Context for global transaction state management
 */

interface TransactionContextValue {
  state: TransactionState;
  dispatch: Dispatch<TransactionAction>;
  /** Load all transactions from repository */
  loadTransactions: () => Promise<void>;
  /** Load transactions for a specific month */
  loadTransactionsByMonth: (month: string) => Promise<void>;
  /** Add a new transaction */
  addTransaction: (input: TransactionInput) => Promise<TransactionFormData>;
  /** Update an existing transaction */
  updateTransaction: (id: string, input: Partial<TransactionInput>) => Promise<TransactionFormData>;
  /** Delete a transaction */
  deleteTransaction: (id: string) => Promise<void>;
}

const TransactionContext = createContext<TransactionContextValue | null>(null);

interface TransactionProviderProps {
  children: ReactNode;
}

export function TransactionProvider({ children }: TransactionProviderProps) {
  const [state, dispatch] = useReducer(transactionReducer, initialTransactionState);

  const loadTransactions = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const transactions = await indexedDBTransactionRepository.getAll();
      dispatch({ type: 'SET_ALL', payload: transactions });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to load transactions',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadTransactionsByMonth = async (month: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const transactions = await indexedDBTransactionRepository.getByMonth(month);
      dispatch({ type: 'SET_ALL', payload: transactions });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to load transactions',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addTransaction = async (input: TransactionInput): Promise<TransactionFormData> => {
    const transaction = await indexedDBTransactionRepository.create(input);
    dispatch({ type: 'ADD', payload: transaction });
    return transaction;
  };

  const updateTransaction = async (
    id: string,
    input: Partial<TransactionInput>
  ): Promise<TransactionFormData> => {
    const transaction = await indexedDBTransactionRepository.update(id, input);
    dispatch({ type: 'UPDATE', payload: transaction });
    return transaction;
  };

  const deleteTransaction = async (id: string): Promise<void> => {
    await indexedDBTransactionRepository.delete(id);
    dispatch({ type: 'DELETE', payload: id });
  };

  return (
    <TransactionContext.Provider
      value={{
        state,
        dispatch,
        loadTransactions,
        loadTransactionsByMonth,
        addTransaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions(): TransactionContextValue {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}
