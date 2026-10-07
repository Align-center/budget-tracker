# Issue 02: Types and Schemas

## Type: task

## Status: done

## Description

Create TypeScript interfaces and Zod validation `_schema_` for all data models.

## Tasks

- [x] Create `src/types/index.ts` with `_transaction_`, `_category_`, `_budget_` interfaces
- [x] Create `src/lib/schemas/transaction.ts` — Zod `_schema_` for transaction `_form_`
- [x] Create `src/lib/schemas/category.ts` — Zod `_schema_` for category `_form_`
- [x] Create `src/lib/schemas/budget.ts` — Zod `_schema_` for budget `_form_`
- [x] Export all `_schema_` from `src/lib/schemas/index.ts`

## Acceptance Criteria

- [x] Types compile without errors
- [x] `_schema_` validate correctly
- [x] `_schema_` export from barrel file
