# Issue 08: Initialize App State

## Type: task

## Status: resolved

## Description

Load data from `_repository_` into `_context_` on app startup.

## Tasks

- [x] Create `src/lib/initialize-app.ts` — load data from `_repository_` into `_context_`
- [x] Add to root layout or providers component
- [x] Handle loading/error states

## Acceptance Criteria

- [x] Data loads on app start
- [x] Loading state shown during initialization
- [x] Error state handled gracefully

## Answer

Created app initialization in:

- `src/lib/initialize-app.ts`: useInitializeApp hook that loads transactions, categories, and budgets from repositories into contexts on app startup. Also exports initializeDB for early DB connection.
- `src/app/app-initializer.tsx`: AppInitializer component that wraps children and shows loading spinner during initialization, error state with retry button on failure.
- `src/app/layout.tsx`: Updated to wrap app with TransactionProvider, CategoryProvider, BudgetProvider, and AppInitializer.

All type-check, lint, and format:check pass.
