'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { CategoryForm } from '@/components/forms/CategoryForm';
import { CategoryList } from '@/components/lists/CategoryList';
import { useCategories } from '@/hooks/useCategories';
import type { CategoryFormData, CategoryInput } from '@/lib/schemas';

export default function CategoriesPage() {
  const { categories, loading, error, addCategory, updateCategory, deleteCategory } =
    useCategories();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryFormData | null>(null);

  const handleAdd = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEdit = (category: CategoryFormData) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleSubmit = async (data: CategoryInput) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, data);
    } else {
      await addCategory(data);
    }
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleDelete = async (id: string) => {
    await deleteCategory(id);
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Categories</h1>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      )}

      <CategoryList
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        loading={loading}
      />

      {showForm && (
        <CategoryForm
          initialData={editingCategory ?? undefined}
          isEditing={!!editingCategory}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
}
