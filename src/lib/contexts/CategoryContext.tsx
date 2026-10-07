'use client';

import { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';
import type { CategoryFormData, CategoryInput } from '@/lib/schemas';
import type { CategoryState, CategoryAction } from '@/lib/reducers/category-reducer';
import { categoryReducer, initialCategoryState } from '@/lib/reducers/category-reducer';
import { indexedDBCategoryRepository } from '@/lib/repositories/indexeddb';

/**
 * Category Context for global category state management
 */

interface CategoryContextValue {
  state: CategoryState;
  dispatch: Dispatch<CategoryAction>;
  /** Load all categories from repository */
  loadCategories: () => Promise<void>;
  /** Load income categories */
  loadIncomeCategories: () => Promise<void>;
  /** Load expense categories */
  loadExpenseCategories: () => Promise<void>;
  /** Add a new category */
  addCategory: (input: CategoryInput) => Promise<CategoryFormData>;
  /** Update an existing category */
  updateCategory: (id: string, input: Partial<CategoryInput>) => Promise<CategoryFormData>;
  /** Delete a category */
  deleteCategory: (id: string) => Promise<void>;
}

const CategoryContext = createContext<CategoryContextValue | null>(null);

interface CategoryProviderProps {
  children: ReactNode;
}

export function CategoryProvider({ children }: CategoryProviderProps) {
  const [state, dispatch] = useReducer(categoryReducer, initialCategoryState);

  const loadCategories = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const categories = await indexedDBCategoryRepository.getAll();
      dispatch({ type: 'SET_ALL', payload: categories });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to load categories',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadIncomeCategories = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const categories = await indexedDBCategoryRepository.getIncome();
      dispatch({ type: 'SET_ALL', payload: categories });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to load categories',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadExpenseCategories = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const categories = await indexedDBCategoryRepository.getExpense();
      dispatch({ type: 'SET_ALL', payload: categories });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to load categories',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addCategory = async (input: CategoryInput): Promise<CategoryFormData> => {
    const category = await indexedDBCategoryRepository.create(input);
    dispatch({ type: 'ADD', payload: category });
    return category;
  };

  const updateCategory = async (
    id: string,
    input: Partial<CategoryInput>
  ): Promise<CategoryFormData> => {
    const category = await indexedDBCategoryRepository.update(id, input);
    dispatch({ type: 'UPDATE', payload: category });
    return category;
  };

  const deleteCategory = async (id: string): Promise<void> => {
    await indexedDBCategoryRepository.delete(id);
    dispatch({ type: 'DELETE', payload: id });
  };

  return (
    <CategoryContext.Provider
      value={{
        state,
        dispatch,
        loadCategories,
        loadIncomeCategories,
        loadExpenseCategories,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories(): CategoryContextValue {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
}
