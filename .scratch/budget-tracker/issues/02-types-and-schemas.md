# Issue 02: Types and Schemas

## Type: task

## Status: open

## Description

Create TypeScript interfaces and Zod validation `_schema_` for all data models.

## Tasks

- [ ] Create `src/types/index.ts` with `_transaction_`, `_category_`, `_budget_` interfaces
- [ ] Create `src/lib/schemas/transaction.ts` — Zod `_schema_` for transaction `_form_`
- [ ] Create `src/lib/schemas/category.ts` — Zod `_schema_` for category `_form_`
- [ ] Create `src/lib/schemas/budget.ts` — Zod `_schema_` for budget `_form_`
- [ ] Export all `_schema_` from `src/lib/schemas/index.ts`

## Acceptance Criteria

- [ ] Types compile without errors
- [ ] `_schema_` validate correctly
- [ ] `_schema_` export from barrel file
