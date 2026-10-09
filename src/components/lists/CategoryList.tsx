'use client';

import { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import {
  Home,
  Utensils,
  ShoppingCart,
  Car,
  Briefcase,
  Heart,
  GraduationCap,
  Gamepad2,
  Plane,
  Gift,
  CreditCard,
  DollarSign,
  Wallet,
  Banknote,
  Coins,
  PiggyBank,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Receipt,
  Ticket,
  Film,
  Music,
  Camera,
  Book,
  Dumbbell,
  Coffee,
  Shirt,
  Gift as GiftIcon,
  Zap,
  Leaf,
  Sun,
  Moon,
  Cloud,
  Droplet,
  Flame,
  Waves,
  Mountain,
  Trees,
  Flower,
  Apple,
  Pizza,
  Beer,
  Wine,
  UtensilsCrossed,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CategoryFormData } from '@/lib/schemas';
import { CategoryForm } from '@/components/forms/CategoryForm';

interface CategoryListProps {
  categories: CategoryFormData[];
  onEdit: (category: CategoryFormData) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  loading?: boolean;
}

export function CategoryList({
  categories,
  onEdit,
  onDelete,
  onAdd,
  loading = false,
}: CategoryListProps) {
  const [editingCategory, setEditingCategory] = useState<CategoryFormData | null>(null);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            data-testid="loading-skeleton"
            className="h-14 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700"
          />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="py-12 text-center">
        <Plus className="mx-auto mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
        <h3 className="mb-1 text-lg font-medium text-zinc-900 dark:text-zinc-100">
          No categories yet
        </h3>
        <p className="mb-4 text-zinc-500 dark:text-zinc-400">
          Create your first category to start tracking
        </p>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {categories.map((category) => (
          <CategoryRow
            key={category.id}
            category={category}
            onEdit={onEdit}
            onDelete={onDelete}
            isEditing={editingCategory?.id === category.id}
          />
        ))}
      </div>

      {editingCategory && (
        <CategoryForm
          initialData={editingCategory}
          isEditing
          onSubmit={async (data) => {
            await onEdit({ ...editingCategory, ...data });
            setEditingCategory(null);
          }}
          onClose={() => setEditingCategory(null)}
        />
      )}
    </>
  );
}

function CategoryRow({
  category,
  onEdit,
  onDelete,
  isEditing,
}: {
  category: CategoryFormData;
  onEdit: (category: CategoryFormData) => void;
  onDelete: (id: string) => void;
  isEditing: boolean;
}) {
  const IconComponent = ICON_MAP[category.icon] || Home;

  const handleDelete = () => {
    if (confirm(`Delete "${category.name}"?`)) {
      onDelete(category.id);
    }
  };

  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-lg border p-3 transition-colors',
        'dark:border-zinc-700 dark:bg-zinc-800/50',
        isEditing
          ? 'bg-blue-50 dark:bg-blue-900/20'
          : 'bg-white hover:bg-zinc-50 dark:bg-zinc-800/50 dark:hover:bg-zinc-700/50'
      )}
    >
      <div
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: category.color }}
      >
        <IconComponent className="h-5 w-5 text-white" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-zinc-900 dark:text-zinc-100">{category.name}</p>
        <p className="text-sm text-zinc-500 capitalize dark:text-zinc-400">{category.type}</p>
      </div>

      <div className="flex items-center gap-2 font-mono text-sm text-zinc-500 dark:text-zinc-400">
        <span>{category.color}</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onEdit(category)}
          disabled={isEditing}
          className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
          aria-label="Edit category"
        >
          <Edit className="h-4 w-4" />
        </button>
        <button
          onClick={handleDelete}
          disabled={isEditing}
          className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
          aria-label="Delete category"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Utensils,
  ShoppingCart,
  Car,
  Briefcase,
  Heart,
  GraduationCap,
  Gamepad2,
  Plane,
  Gift,
  CreditCard,
  DollarSign,
  Wallet,
  Banknote,
  Coins,
  PiggyBank,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Receipt,
  Ticket,
  Film,
  Music,
  Camera,
  Book,
  Dumbbell,
  Coffee,
  Shirt,
  GiftIcon,
  Zap,
  Leaf,
  Sun,
  Moon,
  Cloud,
  Droplet,
  Flame,
  Waves,
  Mountain,
  Trees,
  Flower,
  Apple,
  Pizza,
  Beer,
  Wine,
  UtensilsCrossed,
};
