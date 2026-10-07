# Issue 03: IndexedDB Setup

## Type: task

## Status: resolved

## Description

Set up `_dexie_` database with tables for `_transaction_`, `_category_`, and `_budget_`.

## Tasks

- [x] Create `src/lib/db/dexie.ts` — `_dexie_` database definition
- [x] Define tables: transactions, categories, budgets
- [x] Add indexes for common queries (date, categoryId, month)
- [x] Export database instance

## Acceptance Criteria

- [x] Database opens without errors
- [x] Tables have correct `_schema_`
- [x] Indexes support query patterns

## Answer

Created `src/lib/db/dexie.ts` with:

- `BudgetTrackerDB` class extending Dexie with tables for transactions, categories, and budgets
- Indexes: transactions (id, date, categoryId, [date+categoryId], month), categories (id, name, isIncome), budgets (id, categoryId, month, [categoryId+month])
- Computed `month` property on TransactionEntity for month-based queries
- Database instance singleton `db` exported
- `initDB()` and `closeDB()` helper functions

All type-check, lint, and format:check pass.
