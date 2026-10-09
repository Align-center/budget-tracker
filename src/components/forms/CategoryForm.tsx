'use client';

import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, ChevronDown, Home, CATEGORY_ICONS, ICON_MAP } from '@/lib/icons';
import { cn } from '@/lib/utils';
import type { CategoryInput } from '@/lib/schemas';
import { categoryInputSchema } from '@/lib/schemas';

interface CategoryFormProps {
  initialData?: Partial<CategoryInput>;
  onSubmit: (data: CategoryInput) => Promise<void>;
  onClose: () => void;
  isEditing?: boolean;
}

export function CategoryForm({
  initialData,
  onSubmit,
  onClose,
  isEditing = false,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categoryInputSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      icon: initialData?.icon ?? '',
      color: initialData?.color ?? '#3B82F6',
    },
  });

  const watchedIcon = useWatch({ control, name: 'icon' });
  const watchedColor = useWatch({ control, name: 'color' });

  // Sync form values to local state for icon picker display
  useEffect(() => {
    if (initialData?.icon) setValue('icon', initialData.icon);
    if (initialData?.color) setValue('color', initialData.color);
  }, [initialData, setValue]);

  const handleIconSelect = (iconName: string) => {
    setValue('icon', iconName, { shouldValidate: true });
  };

  const handleColorChange = (newColor: string) => {
    setValue('color', newColor, { shouldValidate: true });
  };

  const onFormSubmit = async (data: CategoryInput) => {
    await onSubmit(data);
  };

  const IconComponent = ICON_MAP[watchedIcon] || Home;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b p-4 dark:border-zinc-700">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {isEditing ? 'Edit Category' : 'Add Category'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 p-4">
          {/* Name Input */}
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name')}
              id="name"
              type="text"
              placeholder="Enter category name"
              className={cn(
                'w-full rounded-lg border bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400',
                'focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none',
                'dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500',
                errors.name ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-600'
              )}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Icon Picker */}
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Icon <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => document.getElementById('icon-picker')?.classList.toggle('hidden')}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg border px-3 py-2',
                  'focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none',
                  'dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100',
                  errors.icon ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-600'
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ backgroundColor: watchedColor }}
                  >
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-zinc-700 capitalize dark:text-zinc-300">
                    {watchedIcon || 'Select icon'}
                  </span>
                </div>
                <ChevronDown className="h-5 w-5 text-zinc-500" />
              </button>

              {/* Icon Picker Dropdown */}
              <div
                id="icon-picker"
                className="absolute top-full right-0 left-0 z-10 mt-1 hidden max-h-96 overflow-y-auto rounded-lg border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
                role="listbox"
              >
                <div className="grid grid-cols-6 gap-1">
                  {CATEGORY_ICONS.map((Icon) => {
                    const iconName = Icon.displayName || '';
                    const isSelected = watchedIcon === iconName;
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => handleIconSelect(iconName)}
                        role="option"
                        aria-selected={isSelected}
                        className={cn(
                          'flex flex-col items-center gap-1 rounded-lg p-2 transition-colors',
                          isSelected
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="truncate text-xs">{iconName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            {errors.icon && (
              <p className="mt-1 text-sm text-red-500" role="alert">
                {errors.icon.message}
              </p>
            )}
          </div>

          {/* Color Picker */}
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Color <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={watchedColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded-lg border border-zinc-300 dark:border-zinc-600"
                aria-label="Pick a color"
              />
              <input
                {...register('color')}
                type="text"
                placeholder="#3B82F6"
                className={cn(
                  'flex-1 rounded-lg border bg-white px-3 py-2 font-mono text-zinc-900 placeholder-zinc-400',
                  'focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none',
                  'dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500',
                  errors.color ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-600'
                )}
              />
            </div>
            {errors.color && (
              <p className="mt-1 text-sm text-red-500" role="alert">
                {errors.color.message}
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
              disabled={isSubmitting}
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
