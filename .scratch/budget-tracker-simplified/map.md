# Budget Tracker Simplified - Effort Map

## Overview

Simplify the budget tracker architecture to match actual requirements: categories + transactions + 2 reports. Remove budgets, repository pattern, contexts, and excess charts/tables.

## Vertical Slices (Tracer Bullets)

Each slice cuts a complete path through schema → DB → hook → UI → tests for one user-facing feature.

| #   | File                           | Title               | Delivers                                                   | Blocked By | Status          |
| --- | ------------------------------ | ------------------- | ---------------------------------------------------------- | ---------- | --------------- |
| 01  | issues/01-categories-crud.md   | Categories CRUD     | Full category management (name, icon, color)               | None       | ready-for-agent |
| 02  | issues/02-transactions-crud.md | Transactions CRUD   | Full transaction management (amount, category, date, note) | 01         | ready-for-agent |
| 03  | issues/03-reports-dashboard.md | Reports & Dashboard | Spending-by-category bar + Income vs Expense doughnut      | 02         | ready-for-agent |
| 04  | issues/04-navigation-layout.md | Navigation & Layout | Top-tab nav across all 3 pages                             | 03         | ready-for-agent |
| 05  | issues/05-e2e-tests.md         | E2E Tests           | 5 Playwright critical flows verified                       | 04         | ready-for-agent |
| 06  | issues/06-cleanup.md           | Cleanup             | Remove budgets, repository, contexts, Recharts             | 05         | ready-for-agent |

## Dependency Chain

```
01 (Categories CRUD)
    ↓
02 (Transactions CRUD — needs category select)
    ↓
03 (Reports & Dashboard — needs transaction data)
    ↓
04 (Navigation & Layout — needs all 3 pages)
    ↓
05 (E2E Tests — needs full navigable app)
    ↓
06 (Cleanup — needs E2E verification)
```

## Notes

- **Each slice includes its own tests**: Unit (schema, DB, hook) + Component (Form, List, Charts) co-located
- **E2E is separate** (cross-cutting, runs on merge)
- **Cleanup last** (removes old architecture after new is verified)
- No horizontal slices (no "schemas only", "DB only", "hooks only" tickets)

## Decisions So Far

From grilling session (2026-10-09):

- Transaction fields: amount (sign=type), categoryId, date, note
- Category fields: name, icon, color (no type)
- No budgets
- Reports: spending by category (horizontal bar), income vs expense (doughnut)
- Data layer: single db.ts with typed CRUD, no repository pattern
- State: custom hooks, no Context
- Charts: Chart.js + react-chartjs-2
- Navigation: top tabs
- Testing: Vitest + RTL + Playwright, co-located tests

## Fog

- Exact icon picker UX (grid of ~30 curated icons)
- Chart color handling (category colors vs fixed palette for doughnut)
- Mobile breakpoint for tab navigation (scrollable vs hamburger)
- E2E test selectors strategy (data-testid vs role)
