import type { CategoryFormData } from '@/lib/schemas';

/**
 * Category Reducer State
 */
export interface CategoryState {
  categories: CategoryFormData[];
  loading: boolean;
  error: string | null;
}

export const initialCategoryState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

/**
 * Category Reducer Actions
 */
export type CategoryAction =
  | { type: 'SET_ALL'; payload: CategoryFormData[] }
  | { type: 'ADD'; payload: CategoryFormData }
  | { type: 'UPDATE'; payload: CategoryFormData }
  | { type: 'DELETE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' };

/**
 * Category Reducer
 * Handles all category state mutations immutably
 */
export function categoryReducer(state: CategoryState, action: CategoryAction): CategoryState {
  switch (action.type) {
    case 'SET_ALL': {
      return {
        ...state,
        categories: action.payload,
        loading: false,
        error: null,
      };
    }

    case 'ADD': {
      return {
        ...state,
        categories: [...state.categories, action.payload],
        error: null,
      };
    }

    case 'UPDATE': {
      return {
        ...state,
        categories: state.categories.map((c) => (c.id === action.payload.id ? action.payload : c)),
        error: null,
      };
    }

    case 'DELETE': {
      return {
        ...state,
        categories: state.categories.filter((c) => c.id !== action.payload),
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
