# Issue 06: Context Providers

## Type: task

## Status: resolved

## Description

Create `_context_` providers for global state management using `_reducer_`.

## Tasks

- [x] Create `src/lib/contexts/TransactionContext.tsx` — `_context_` provider + `useTransactions` hook
- [x] Create `src/lib/contexts/CategoryContext.tsx` — `_context_` provider + `useCategories` hook
- [x] Create `src/lib/contexts/BudgetContext.tsx` — `_context_` provider + `useBudgets` hook
- [x] Create `src/lib/contexts/index.ts` — barrel export

## Acceptance Criteria

- [x] `_context_` providers expose state and actions
- [x] Custom hooks work correctly
- [x] Barrel export works

## Answer

Created context providers in `src/lib/contexts/`:

- `TransactionContext.tsx`: TransactionProvider + useTransactions hook with loadTransactions, loadTransactionsByMonth, addTransaction, updateTransaction, deleteTransaction
- `CategoryContext.tsx`: CategoryProvider + useCategories hook with loadCategories, loadIncomeCategories, loadExpenseCategories, addCategory, updateCategory, deleteCategory
- `BudgetContext.tsx`: BudgetProvider + useBudgets hook with loadBudgets, loadBudgetsByMonth, addBudget, updateBudget, deleteBudget
- `index.ts`: Barrel export

Also created reducers in `src/lib/reducers/` (Issue 07):

- `transaction-reducer.ts`: TransactionState, TransactionAction, transactionReducer, initialTransactionState
- `category-reducer.ts`: CategoryState, CategoryAction, categoryReducer, initialCategoryState
- `budget-reducer.ts`: BudgetState, BudgetAction, budgetReducer, initialBudgetState
- `index.ts`: Barrel export

All type-check, lint, and format:check pass.
