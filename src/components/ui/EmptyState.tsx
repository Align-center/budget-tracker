'use client';

import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  cta?: { label: string; href: string };
  className?: string;
}

/**
 * Reusable empty state component for consistent empty data UX.
 * Provides centered illustration, title, optional description, and optional CTA.
 */
export function EmptyState({ icon, title, description, cta, className = '' }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-12 dark:border-zinc-700 dark:bg-zinc-800',
        className
      )}
      role="img"
      aria-label={title}
    >
      <div className="mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-600" aria-hidden="true">
        {icon}
      </div>
      <h3 className="mb-2 text-center text-lg font-medium text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>
      {description && (
        <p className="mx-auto mb-6 max-w-md text-center text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      )}
      {cta && (
        <a
          href={cta.href}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-white transition-colors hover:bg-blue-700"
        >
          {cta.label}
        </a>
      )}
    </div>
  );
}
