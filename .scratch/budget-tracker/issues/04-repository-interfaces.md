# Issue 04: Repository Interfaces

## Type: task

## Status: resolved

## Description

Define `_repository_` interfaces for the Repository pattern to enable swappable storage.

## Tasks

- [x] Create `src/lib/repositories/transaction-repository.ts` — `_repository_` interface
- [x] Create `src/lib/repositories/category-repository.ts` — `_repository_` interface
- [x] Create `src/lib/repositories/budget-repository.ts` — `_repository_` interface
- [x] Create `src/lib/repositories/index.ts` — barrel export

## Acceptance Criteria

- [x] `_repository_` interfaces define all needed CRUD operations
- [x] Query methods included (getByMonth, getByCategory, getDateRange, getSummary)
- [x] Barrel export works

## Answer

Created repository interfaces in `src/lib/repositories/`:

- `transaction-repository.ts`: TransactionRepository with CRUD + getByMonth, getByCategory, getByDateRange, getSummary, bulkCreate
- `category-repository.ts`: CategoryRepository with CRUD + getIncome, getExpense
- `budget-repository.ts`: BudgetRepository with CRUD + getByMonth, getByCategoryAndMonth, getByCategory
- `index.ts`: Barrel export with type re-exports

All type-check, lint, and format:check pass.
