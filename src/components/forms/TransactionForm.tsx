'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Calendar, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import type { TransactionInput } from '@/lib/schemas';
import { transactionInputSchema } from '@/lib/schemas';
import { useCategories } from '@/hooks/useCategories';

interface TransactionFormProps {
  initialData?: Partial<TransactionInput>;
  onSubmit: (data: TransactionInput) => Promise<void>;
  onClose: () => void;
  isEditing?: boolean;
}

export function TransactionForm({
  initialData,
  onSubmit,
  onClose,
  isEditing = false,
}: TransactionFormProps) {
  const { categories, loading: categoriesLoading } = useCategories();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TransactionInput>({
    resolver: zodResolver(transactionInputSchema),
    defaultValues: {
      amount: initialData?.amount ?? 0,
      categoryId: initialData?.categoryId ?? '',
      date: initialData?.date ?? new Date().toISOString().split('T')[0],
      note: initialData?.note ?? '',
    },
  });

  const watchedCategoryId = useWatch({ control, name: 'categoryId' });
  const watchedNote = useWatch({ control, name: 'note' });

  const selectedCategory = categories.find((c) => c.id === watchedCategoryId);

  const handleCategorySelect = (categoryId: string) => {
    setValue('categoryId', categoryId, { shouldValidate: true });
  };

  const onFormSubmit = async (data: TransactionInput) => {
    await onSubmit(data);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b p-4 dark:border-zinc-700">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {isEditing ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 p-4" noValidate>
          {/* Amount Input */}
          <div>
            <label
              htmlFor="amount"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-500">$</span>
              <input
                {...register('amount', { valueAsNumber: true })}
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                className={cn(
                  'w-full rounded-lg border bg-white py-2 pr-3 pl-7 text-zinc-900 placeholder-zinc-400',
                  'focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none',
                  'dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500',
                  errors.amount ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-600'
                )}
              />
            </div>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Positive = income, Negative = expense
            </p>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-500" role="alert">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Category Select */}
          <div>
            <label
              htmlFor="categoryId"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Category <span className="text-red-500">*</span>
            </label>
            {categoriesLoading ? (
              <div className="h-10 animate-pulse rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800" />
            ) : (
              <>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById('category-picker')?.classList.toggle('hidden')
                    }
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg border px-3 py-2',
                      'focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none',
                      'dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100',
                      errors.categoryId ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-600'
                    )}
                    disabled={categories.length === 0}
                  >
                    <div className="flex items-center gap-3">
                      {selectedCategory ? (
                        <CategoryBadge
                          name={selectedCategory.name}
                          icon={selectedCategory.icon}
                          color={selectedCategory.color}
                          size="md"
                        />
                      ) : (
                        <span className="text-zinc-500 dark:text-zinc-400">Select category</span>
                      )}
                    </div>
                    <ChevronDown className="h-5 w-5 text-zinc-500" />
                  </button>

                  {/* Category Picker Dropdown */}
                  <div
                    id="category-picker"
                    className="absolute top-full right-0 left-0 z-10 mt-1 hidden max-h-96 overflow-y-auto rounded-lg border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
                    role="listbox"
                  >
                    <div className="space-y-1">
                      {categories.map((category) => {
                        const isSelected = watchedCategoryId === category.id;
                        return (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() => handleCategorySelect(category.id)}
                            role="option"
                            aria-selected={isSelected}
                            className={cn(
                              'flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors',
                              isSelected
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700'
                            )}
                          >
                            <CategoryBadge
                              name={category.name}
                              icon={category.icon}
                              color={category.color}
                              size="sm"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                {errors.categoryId && (
                  <p className="mt-1 text-sm text-red-500" role="alert">
                    {errors.categoryId.message}
                  </p>
                )}
                {categories.length === 0 && (
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    No categories available.{' '}
                    <a href="/categories" className="text-blue-600 hover:underline">
                      Create one first
                    </a>
                  </p>
                )}
              </>
            )}
          </div>

          {/* Date Picker */}
          <div>
            <label
              htmlFor="date"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                {...register('date')}
                id="date"
                type="date"
                max={today}
                className={cn(
                  'w-full rounded-lg border bg-white py-2 pr-3 pl-10 text-zinc-900 placeholder-zinc-400',
                  'focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none',
                  'dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500',
                  errors.date ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-600'
                )}
              />
              <Calendar
                className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-zinc-500"
                aria-hidden="true"
              />
            </div>
            {errors.date && (
              <p className="mt-1 text-sm text-red-500" role="alert">
                {errors.date.message}
              </p>
            )}
          </div>

          {/* Note Textarea */}
          <div>
            <label
              htmlFor="note"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Note (optional)
            </label>
            <textarea
              {...register('note')}
              id="note"
              rows={3}
              placeholder="Add a note..."
              className={cn(
                'w-full rounded-lg border bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400',
                'focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none',
                'dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500',
                errors.note ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-600'
              )}
            />
            <p className="mt-1 text-right text-xs text-zinc-500 dark:text-zinc-400">
              {watchedNote?.length ?? 0}/255
            </p>
            {errors.note && (
              <p className="mt-1 text-sm text-red-500" role="alert">
                {errors.note.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t pt-4 dark:border-zinc-700">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || categories.length === 0}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
