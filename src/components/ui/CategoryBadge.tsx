'use client';

import { ICON_MAP } from '@/lib/icons';
import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  name: string;
  icon: string;
  color: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES = {
  sm: 'h-6 w-6 text-[11px]',
  md: 'h-8 w-8 text-sm',
  lg: 'h-10 w-10 text-base',
};

const ICON_SIZE_CLASSES = {
  sm: 'h-3.5 w-3.5',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export function CategoryBadge({ name, icon, color, className, size = 'md' }: CategoryBadgeProps) {
  const IconComponent = ICON_MAP[icon];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'flex flex-shrink-0 items-center justify-center rounded-lg',
          SIZE_CLASSES[size]
        )}
        style={{ backgroundColor: color }}
        aria-hidden="true"
      >
        {IconComponent && <IconComponent className={cn('text-white', ICON_SIZE_CLASSES[size])} />}
      </div>
      <span className="truncate font-medium text-zinc-900 dark:text-zinc-100">{name}</span>
    </div>
  );
}
