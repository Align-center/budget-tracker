# Issue 20: Report Utilities

## Type: task
## Status: open

## Description
Create calculation utilities for `_report_`.

## Tasks
- [ ] Create `src/lib/reports/calculations.ts` — helper functions
  - `getSpendingByCategory(_transaction_, _category_, month)`
  - `getSpendingTrend(_transaction_, months)` — daily/weekly/monthly
  - `getBudgetComparison(_budget_, _transaction_, _category_)`
  - `getIncomeVsExpense(_transaction_, month)`

## Acceptance Criteria
- [ ] All functions return correct data
- [ ] Functions handle edge cases (empty data, missing `_category_`)
- [ ] Types are correct