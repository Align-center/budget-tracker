import type { BudgetFormData } from '@/lib/schemas';

/**
 * Budget Reducer State
 */
export interface BudgetState {
  budgets: BudgetFormData[];
  loading: boolean;
  error: string | null;
}

export const initialBudgetState: BudgetState = {
  budgets: [],
  loading: false,
  error: null,
};

/**
 * Budget Reducer Actions
 */
export type BudgetAction =
  | { type: 'SET_ALL'; payload: BudgetFormData[] }
  | { type: 'ADD'; payload: BudgetFormData }
  | { type: 'UPDATE'; payload: BudgetFormData }
  | { type: 'DELETE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' };

/**
 * Budget Reducer
 * Handles all budget state mutations immutably
 */
export function budgetReducer(state: BudgetState, action: BudgetAction): BudgetState {
  switch (action.type) {
    case 'SET_ALL': {
      return {
        ...state,
        budgets: action.payload,
        loading: false,
        error: null,
      };
    }

    case 'ADD': {
      return {
        ...state,
        budgets: [...state.budgets, action.payload],
        error: null,
      };
    }

    case 'UPDATE': {
      return {
        ...state,
        budgets: state.budgets.map((b) => (b.id === action.payload.id ? action.payload : b)),
        error: null,
      };
    }

    case 'DELETE': {
      return {
        ...state,
        budgets: state.budgets.filter((b) => b.id !== action.payload),
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
