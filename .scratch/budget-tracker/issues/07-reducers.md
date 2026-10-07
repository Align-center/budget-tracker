# Issue 07: Reducers

## Type: task

## Status: resolved

## Description

Create `_reducer_` logic for each domain entity.

## Tasks

- [x] Create `src/lib/reducers/transaction-reducer.ts` — `_reducer_` with actions: add, update, delete, setAll
- [x] Create `src/lib/reducers/category-reducer.ts` — `_reducer_` with actions: add, update, delete, setAll
- [x] Create `src/lib/reducers/budget-reducer.ts` — `_reducer_` with actions: add, update, delete, setAll
- [x] Create `src/lib/reducers/index.ts` — barrel export

## Acceptance Criteria

- [x] `_reducer_` handle all actions correctly
- [x] State immutability maintained
- [x] Barrel export works

## Answer

Created reducers in `src/lib/reducers/`:

- `transaction-reducer.ts`: TransactionState, TransactionAction (SET_ALL, ADD, UPDATE, DELETE, SET_LOADING, SET_ERROR, CLEAR_ERROR), transactionReducer, initialTransactionState
- `category-reducer.ts`: CategoryState, CategoryAction, categoryReducer, initialCategoryState
- `budget-reducer.ts`: BudgetState, BudgetAction, budgetReducer, initialBudgetState
- `index.ts`: Barrel export with types and reducers

All reducers maintain state immutability. All type-check, lint, and format:check pass.
