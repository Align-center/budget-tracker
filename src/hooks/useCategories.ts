'use client';

import { useState, useCallback, useEffect } from 'react';
import type { CategoryFormData, CategoryInput } from '@/lib/schemas';
import { categoryDb } from '@/lib/db';

interface UseCategoriesReturn {
  categories: CategoryFormData[];
  loading: boolean;
  error: string | null;
  addCategory: (input: CategoryInput) => Promise<CategoryFormData | null>;
  updateCategory: (id: string, input: Partial<CategoryInput>) => Promise<CategoryFormData | null>;
  deleteCategory: (id: string) => Promise<boolean>;
  refreshCategories: () => Promise<void>;
  checkNameUnique: (name: string, excludeId?: string) => Promise<boolean>;
}

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<CategoryFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryDb.getAll();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshCategories();
  }, [refreshCategories]);

  const addCategory = useCallback(
    async (input: CategoryInput): Promise<CategoryFormData | null> => {
      try {
        setError(null);
        const nameExists = await categoryDb.nameExists(input.name);
        if (nameExists) {
          setError('A category with this name already exists');
          return null;
        }
        const newCategory = await categoryDb.create(input);
        setCategories((prev) =>
          [...prev, newCategory].sort((a, b) => a.name.localeCompare(b.name))
        );
        return newCategory;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create category');
        return null;
      }
    },
    []
  );

  const updateCategory = useCallback(
    async (id: string, input: Partial<CategoryInput>): Promise<CategoryFormData | null> => {
      try {
        setError(null);
        if (input.name) {
          const nameExists = await categoryDb.nameExists(input.name, id);
          if (nameExists) {
            setError('A category with this name already exists');
            return null;
          }
        }
        const updated = await categoryDb.update(id, input);
        if (updated) {
          setCategories((prev) =>
            prev
              .map((c) => (c.id === id ? updated : c))
              .sort((a, b) => a.name.localeCompare(b.name))
          );
        }
        return updated ?? null;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update category');
        return null;
      }
    },
    []
  );

  const deleteCategory = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const success = await categoryDb.delete(id);
      if (success) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
      return false;
    }
  }, []);

  const checkNameUnique = useCallback(
    async (name: string, excludeId?: string): Promise<boolean> => {
      return categoryDb.nameExists(name, excludeId);
    },
    []
  );

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    refreshCategories,
    checkNameUnique,
  };
}
