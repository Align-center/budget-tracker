# Issue 15: Transaction Form

## Type: task
## Status: open

## Description
Create `_form_` for creating/editing `_transaction_`.

## Tasks
- [ ] Create `src/components/transactions/TransactionForm.tsx` — `_form_` with React Hook Form + Zod `_schema_`
- [ ] Fields: amount (number, required), `_category_` (Select, required), date (DatePicker, required), note (optional), venue (optional)
- [ ] `_category_` select filters by isIncome based on amount sign
- [ ] Integrate with `_context_` for create/update

## Acceptance Criteria
- [ ] `_form_` validates correctly
- [ ] `_category_` filter by income/expense works
- [ ] Date picker works
- [ ] Create and update both work