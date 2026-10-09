# Budget Tracker - Simplified Architecture Spec

## Problem Statement

The current budget tracker architecture is over-engineered for the actual feature requirements. It includes:

- Repository pattern with interfaces (preparing for HTTP sync that doesn't exist yet)
- Budget tracking feature (monthly budgets per category) that adds significant complexity
- Reports with 4 chart types and 3 table types when only 2 charts are needed
- Context + Reducer pattern for state management that adds indirection
- Transaction schema with `description`, `type`, `venue` fields when only `note` is needed
- Category schema with income/expense type constraint that limits flexibility

The user wants a minimal, maintainable implementation that covers exactly:

1. Custom categories with icons and colors
2. Transactions with amount, category, date, note (no venue, no explicit type)
3. Two reports: spending by category, income vs expense
4. IndexedDB persistence
5. Clean, simple code without premature abstractions

## Solution

A simplified budget tracker with:

- **Two entities**: Categories and Transactions (no Budgets)
- **Direct data access**: Single `db.ts` wrapper around Dexie/IndexedDB with typed CRUD functions
- **Hook-based state**: Custom React hooks (`useCategories`, `useTransactions`, `useReports`) calling DB directly
- **Minimal schemas**: Zod schemas with only required fields
- **Two charts**: Horizontal bar (spending by category) + Doughnut (income vs expense) using Chart.js
- **Three pages**: Dashboard (reports), Transactions, Categories — top-tab navigation

## User Stories

1. As a user, I want to create custom categories with a name, icon, and color, so that I can organize my transactions meaningfully
2. As a user, I want to edit and delete categories, so that I can keep my category list current
3. As a user, I want to add transactions with amount, category, date, and optional note, so that I can record my spending and income
4. As a user, I want to edit and delete transactions, so that I can correct mistakes
5. As a user, I want positive amounts to represent income and negative amounts to represent expenses, so that I don't need a separate type selector
6. As a user, I want to see a horizontal bar chart showing total spending per category, so that I can visualize where my money goes
7. As a user, I want to see a doughnut chart comparing total income vs total expenses, so that I can understand my financial balance
8. As a user, I want my data to persist in IndexedDB across browser sessions, so that I don't lose my records
9. As a user, I want a responsive UI that works on mobile and desktop, so that I can use the app anywhere
10. As a user, I want form validation with clear error messages, so that I can't submit invalid data
11. As a developer, I want unit tests for schemas, hooks, and DB logic, so that regressions are caught early
12. As a developer, I want component tests for forms and lists, so that UI behavior is verified
13. As a developer, I want E2E tests for critical user flows, so that the full app works end-to-end

## Implementation Decisions

### Data Models

**Transaction** (stored in IndexedDB):

- `id`: string (UUID)
- `amount`: number (positive = income, negative = expense, never zero)
- `categoryId`: string (references Category.id)
- `date`: string (YYYY-MM-DD format)
- `note`: string (optional, max 255 chars)
- `createdAt`: string (ISO datetime)
- `updatedAt`: string (ISO datetime)

**Category** (stored in IndexedDB):

- `id`: string (UUID)
- `name`: string (required, max 100 chars, unique case-insensitive)
- `icon`: string (required, lucide-react icon name)
- `color`: string (required, hex format #RRGGBB)
- `createdAt`: string (ISO datetime)
- `updatedAt`: string (ISO datetime)

_No `isIncome`/`type` on Category — categories are neutral, type derived from transaction amount sign._

### Data Layer (`src/lib/db.ts`)

Single file exporting typed CRUD functions per entity:

- `categories`: `getAll()`, `add(input)`, `update(id, input)`, `delete(id)`
- `transactions`: `getAll()`, `add(input)`, `update(id, input)`, `delete(id)`

No query helpers (filter/sort in hooks). Uses Dexie directly. In-memory Dexie with `fake-indexeddb` for tests.

### State Management (`src/hooks/`)

Three custom hooks, no Context:

- `useCategories()` → `{ categories, addCategory, updateCategory, deleteCategory, loading, error }`
- `useTransactions()` → `{ transactions, addTransaction, updateTransaction, deleteTransaction, loading, error }`
- `useReports()` → derives from `useTransactions`: `{ spendingByCategory, incomeVsExpense, loading }`

Hooks manage local React state, call DB wrapper, handle loading/error states.

### Validation Schemas (`src/lib/schemas/`)

**TransactionInputSchema** (Zod):

```typescript
{
  amount: z.number().refine(v => v !== 0, 'Amount must not be zero'),
  categoryId: z.string().min(1, 'Category is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  note: z.string().max(255).optional(),
}
```

**CategoryInputSchema** (Zod):

```typescript
{
  name: z.string().min(1).max(100),
  icon: z.string().min(1).max(50),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
}
```

- unique name validation at hook level.

### UI Structure

**Pages** (Next.js App Router, `(dashboard)` route group):

- `/` — Dashboard: shows both charts (empty states when no data)
- `/transactions` — Transaction list + add/edit dialog with form
- `/categories` — Category list + add/edit dialog with form

**Navigation**: Top tab bar (Dashboard | Transactions | Categories), mobile-responsive.

**Forms** (React Hook Form + Zod):

- TransactionForm: Amount (number, required) → Category (select, required) → Date (date picker, default today, max today) → Note (text, optional)
- CategoryForm: Name (text, required) → Icon (curated grid of ~30 lucide icons) → Color (hex input + color picker)

**Lists**: Simple tables with edit/delete actions per row.

**Charts** (Chart.js + react-chartjs-2):

- `SpendingByCategoryChart`: Horizontal bar chart. X=amount (absolute), Y=category name. Bars colored by category.color. Tooltip shows category + amount.
- `IncomeExpenseChart`: Doughnut chart. Two segments: Income (green, sum of positive amounts), Expense (red, sum of absolute negative amounts). Legend + tooltips.

### Date Handling

- Store as `YYYY-MM-DD` strings in DB
- Use `date-fns` for formatting/display
- No timezone logic — user's local date as entered

### Empty States

- Categories page: "No categories yet. Create your first category."
- Transactions page: "No transactions yet. Add a transaction."
- Dashboard: Both charts show illustrated empty states with CTAs to add data.

### File Structure

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx          # Top nav shell
│   │   ├── page.tsx            # Dashboard (charts)
│   │   ├── categories/page.tsx
│   │   └── transactions/page.tsx
│   ├── globals.css
│   └── layout.tsx
├── lib/
│   ├── db.ts                   # Dexie wrapper + CRUD
│   ├── schemas/
│   │   ├── category.ts
│   │   └── transaction.ts
│   └── utils.ts                # date-fns helpers, formatters
├── hooks/
│   ├── useCategories.ts
│   ├── useTransactions.ts
│   └── useReports.ts
├── components/
│   ├── ui/                     # Radix + Tailwind primitives
│   ├── forms/
│   │   ├── CategoryForm.tsx
│   │   └── TransactionForm.tsx
│   ├── lists/
│   │   ├── CategoryList.tsx
│   │   └── TransactionList.tsx
│   └── charts/
│       ├── SpendingByCategoryChart.tsx
│       └── IncomeExpenseChart.tsx
```

## Testing Decisions

### Test Stack

- **Unit/Component**: Vitest + React Testing Library (`@testing-library/react`)
- **E2E**: Playwright
- **Coverage**: Vitest v8 provider (`vitest --coverage`)

### Test Matrix

| Layer      | Tool                    | Target       | Strategy                                            |
| ---------- | ----------------------- | ------------ | --------------------------------------------------- |
| Schemas    | Vitest                  | 100%         | Test valid/invalid inputs, error messages           |
| Utils      | Vitest                  | 100%         | Pure function tests                                 |
| DB wrapper | Vitest + fake-indexeddb | 90%          | Real Dexie API, in-memory DB                        |
| Hooks      | Vitest + renderHook     | 90%          | Test logic, state transitions, DB calls             |
| Components | RTL                     | 80%          | User interactions, validation, loading/error states |
| Charts     | RTL                     | Basic render | Snapshot test, verify props → render                |
| E2E        | Playwright              | 5 flows      | Critical paths only                                 |

### Test Organization

- Co-located: `Component.tsx` + `Component.test.tsx` in same folder
- E2E tests in `e2e/` at repo root

### Good Test Principles

- Test external behavior, not implementation details
- Use RTL queries (`getByRole`, `getByLabelText`, `getByText`)
- Mock DB wrapper in hook/component tests (not real IndexedDB)
- Test error paths and loading states
- No snapshot testing for logic; only for chart rendering

### CI Integration

- Every PR: `pnpm lint`, `pnpm typecheck`, `pnpm test` (unit + component)
- On merge to main: `pnpm test:e2e` (Playwright)
- Coverage reported on PR

## Out of Scope

- Budget tracking (monthly limits, budget vs actual)
- Trends over time chart (line chart)
- Budget comparison chart
- Category breakdown table with budget %
- Monthly comparison table
- Transaction detail table (filterable list lives on transaction page)
- Recurring transactions
- Multiple accounts
- Data export/import (CSV, JSON)
- Dark mode (beyond OS preference via Tailwind)
- Self-hosted sync backend
- Budget alerts/notifications
- Category groups/hierarchy
- Tags for transactions
- Venue/location on transactions
- Explicit income/expense type selector on transactions
- Income/expense type on categories
- Repository pattern / interface abstraction
- Context + Reducer pattern
- Recharts (replaced by Chart.js)

## Further Notes

### Migration from Current Code

- Delete: `src/lib/schemas/budget.ts`, budget-related issues, repository pattern files
- Simplify: `transaction.ts` (remove type, description, venue → add note), `category.ts` (remove type)
- Remove: Context providers, reducers, repository interfaces
- Add: `db.ts`, hooks, Chart.js charts, simplified forms/lists

### Dependencies to Add

- `chart.js`, `react-chartjs-2` (charts)
- `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `fake-indexeddb` (testing)
- `@playwright/test` (E2E)

### Dependencies to Remove

- `recharts` (no longer used)
- Budget-related types/code

### Icon Set

Curated ~30 lucide-react icons covering: salary, wallet, credit-card, shopping-bag, utensils, coffee, car, bus, train, plane, home, heart, gamepad-2, film, music, book, dumbbell, pill, gift, briefcase, graduation-cap, smartphone, laptop, monitor, camera, badge-percent, tag, receipt, file-text, calendar.

### Accessibility

- Semantic HTML (tables, forms, headings)
- ARIA labels on icon-only buttons
- Focus management in dialogs
- Color contrast (category colors used in charts — ensure text labels also present)
- Keyboard navigation throughout
