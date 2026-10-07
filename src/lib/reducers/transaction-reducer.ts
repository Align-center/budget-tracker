import type { TransactionFormData } from '@/lib/schemas';

/**
 * Transaction Reducer State
 */
export interface TransactionState {
  transactions: TransactionFormData[];
  loading: boolean;
  error: string | null;
}

export const initialTransactionState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
};

/**
 * Transaction Reducer Actions
 */
export type TransactionAction =
  | { type: 'SET_ALL'; payload: TransactionFormData[] }
  | { type: 'ADD'; payload: TransactionFormData }
  | { type: 'UPDATE'; payload: TransactionFormData }
  | { type: 'DELETE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' };

/**
 * Transaction Reducer
 * Handles all transaction state mutations immutably
 */
export function transactionReducer(
  state: TransactionState,
  action: TransactionAction
): TransactionState {
  switch (action.type) {
    case 'SET_ALL': {
      return {
        ...state,
        transactions: action.payload,
        loading: false,
        error: null,
      };
    }

    case 'ADD': {
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
        error: null,
      };
    }

    case 'UPDATE': {
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
        error: null,
      };
    }

    case 'DELETE': {
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
        error: null,
      };
    }

    case 'SET_LOADING': {
      return {
        ...state,
        loading: action.payload,
      };
    }

    case 'SET_ERROR': {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    }

    case 'CLEAR_ERROR': {
      return {
        ...state,
        error: null,
      };
    }

    default: {
      return state;
    }
  }
}
