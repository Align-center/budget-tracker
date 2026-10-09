import { renderHook, act } from '@testing-library/react';
import { useCategories } from '@/hooks/useCategories';
import { categoryDb } from '@/lib/db';
import type { CategoryFormData, CategoryInput } from '@/lib/schemas';
import { vi } from 'vitest';

vi.mock('@/lib/db', () => ({
  categoryDb: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    nameExists: vi.fn(),
  },
}));

const mockCategories: CategoryFormData[] = [
  {
    id: '1',
    name: 'Food',
    icon: 'Utensils',
    color: '#FF5733',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Salary',
    icon: 'Briefcase',
    color: '#3B82F6',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
];

const mockCategoryInput: CategoryInput = {
  name: 'Transport',
  icon: 'Car',
  color: '#10B981',
};

describe('useCategories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (categoryDb.getAll as ReturnType<typeof vi.fn>).mockResolvedValue(mockCategories);
    (categoryDb.nameExists as ReturnType<typeof vi.fn>).mockResolvedValue(false);
  });

  it('loads categories on mount', async () => {
    const { result } = renderHook(() => useCategories());

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.categories).toEqual(mockCategories);
    expect(categoryDb.getAll).toHaveBeenCalledTimes(1);
  });

  it('handles getAll error', async () => {
    (categoryDb.getAll as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('DB Error'));

    const { result } = renderHook(() => useCategories());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('DB Error');
    expect(result.current.categories).toEqual([]);
  });

  it('adds a new category', async () => {
    const newCategory: CategoryFormData = {
      ...mockCategoryInput,
      id: '3',
      createdAt: '2024-01-03T00:00:00.000Z',
      updatedAt: '2024-01-03T00:00:00.000Z',
    };

    (categoryDb.create as ReturnType<typeof vi.fn>).mockResolvedValue(newCategory);
    (categoryDb.nameExists as ReturnType<typeof vi.fn>).mockResolvedValue(false);

    const { result } = renderHook(() => useCategories());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    let addedCategory: CategoryFormData | null = null;
    await act(async () => {
      addedCategory = await result.current.addCategory(mockCategoryInput);
    });

    expect(addedCategory).toEqual(newCategory);
    expect(categoryDb.create).toHaveBeenCalledWith(mockCategoryInput);
    expect(result.current.categories).toHaveLength(3);
    expect(result.current.categories[2]).toEqual(newCategory);
  });

  it('rejects duplicate category name on add', async () => {
    (categoryDb.nameExists as ReturnType<typeof vi.fn>).mockResolvedValue(true);

    const { result } = renderHook(() => useCategories());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    let addedCategory: CategoryFormData | null = null;
    await act(async () => {
      addedCategory = await result.current.addCategory(mockCategoryInput);
    });

    expect(addedCategory).toBeNull();
    expect(result.current.error).toBe('A category with this name already exists');
    expect(categoryDb.create).not.toHaveBeenCalled();
  });

  it('updates an existing category', async () => {
    const updatedCategory: CategoryFormData = {
      ...mockCategories[0],
      name: 'Groceries',
      updatedAt: '2024-01-03T00:00:00.000Z',
    };

    (categoryDb.update as ReturnType<typeof vi.fn>).mockResolvedValue(updatedCategory);
    (categoryDb.nameExists as ReturnType<typeof vi.fn>).mockResolvedValue(false);

    const { result } = renderHook(() => useCategories());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    let updated: CategoryFormData | null = null;
    await act(async () => {
      updated = await result.current.updateCategory('1', { name: 'Groceries' });
    });

    expect(updated).toEqual(updatedCategory);
    expect(categoryDb.update).toHaveBeenCalledWith('1', { name: 'Groceries' });
    expect(result.current.categories.find((c) => c.id === '1')?.name).toBe('Groceries');
  });

  it('rejects duplicate category name on update', async () => {
    (categoryDb.nameExists as ReturnType<typeof vi.fn>).mockResolvedValue(true);

    const { result } = renderHook(() => useCategories());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    let updated: CategoryFormData | null = null;
    await act(async () => {
      updated = await result.current.updateCategory('1', { name: 'Salary' });
    });

    expect(updated).toBeNull();
    expect(result.current.error).toBe('A category with this name already exists');
    expect(categoryDb.update).not.toHaveBeenCalled();
  });

  it('deletes a category', async () => {
    (categoryDb.delete as ReturnType<typeof vi.fn>).mockResolvedValue(true);

    const { result } = renderHook(() => useCategories());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    let deleted: boolean = false;
    await act(async () => {
      deleted = await result.current.deleteCategory('1');
    });

    expect(deleted).toBe(true);
    expect(categoryDb.delete).toHaveBeenCalledWith('1');
    expect(result.current.categories).toHaveLength(1);
    expect(result.current.categories.find((c) => c.id === '1')).toBeUndefined();
  });

  it('returns false when deleting non-existent category', async () => {
    (categoryDb.delete as ReturnType<typeof vi.fn>).mockResolvedValue(false);

    const { result } = renderHook(() => useCategories());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    let deleted: boolean = false;
    await act(async () => {
      deleted = await result.current.deleteCategory('999');
    });

    expect(deleted).toBe(false);
  });

  it('checks name uniqueness', async () => {
    (categoryDb.nameExists as ReturnType<typeof vi.fn>).mockResolvedValue(true);

    const { result } = renderHook(() => useCategories());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    let exists: boolean = false;
    await act(async () => {
      exists = await result.current.checkNameUnique('Food');
    });

    expect(exists).toBe(true);
    expect(categoryDb.nameExists).toHaveBeenCalledWith('Food', undefined);
  });

  it('checks name uniqueness with excludeId', async () => {
    (categoryDb.nameExists as ReturnType<typeof vi.fn>).mockResolvedValue(false);

    const { result } = renderHook(() => useCategories());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    let exists: boolean = false;
    await act(async () => {
      exists = await result.current.checkNameUnique('Food', '1');
    });

    expect(exists).toBe(false);
    expect(categoryDb.nameExists).toHaveBeenCalledWith('Food', '1');
  });

  it('refreshes categories', async () => {
    (categoryDb.getAll as ReturnType<typeof vi.fn>).mockResolvedValue(mockCategories);

    const { result } = renderHook(() => useCategories());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const newCategories = [...mockCategories, { ...mockCategories[0], id: '3', name: 'Transport' }];
    (categoryDb.getAll as ReturnType<typeof vi.fn>).mockResolvedValue(newCategories);

    await act(async () => {
      await result.current.refreshCategories();
    });

    expect(categoryDb.getAll).toHaveBeenCalledTimes(2);
    expect(result.current.categories).toEqual(newCategories);
  });
});
