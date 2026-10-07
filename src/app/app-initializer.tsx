'use client';

import { useInitializeApp } from '@/lib/initialize-app';
import { ReactNode, Suspense } from 'react';

/**
 * AppInitializer - Initializes the app by loading data from repositories
 * Shows loading state during initialization
 */
export function AppInitializer({ children }: { children: ReactNode }) {
  const { loading, error } = useInitializeApp();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
          <p className="text-gray-600 dark:text-gray-400">Loading budget tracker...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="p-4 text-center">
          <p className="mb-4 text-red-600 dark:text-red-400">Failed to initialize app: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-primary/90 rounded-lg px-4 py-2 text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <Suspense fallback={null}>{children}</Suspense>;
}
