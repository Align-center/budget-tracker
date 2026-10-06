# Issue 03: IndexedDB Setup

## Type: task
## Status: open

## Description
Set up `_dexie_` database with tables for `_transaction_`, `_category_`, and `_budget_`.

## Tasks
- [ ] Create `src/lib/db/dexie.ts` — `_dexie_` database definition
- [ ] Define tables: transactions, categories, budgets
- [ ] Add indexes for common queries (date, categoryId, month)
- [ ] Export database instance

## Acceptance Criteria
- [ ] Database opens without errors
- [ ] Tables have correct `_schema_`
- [ ] Indexes support query patterns