# 02: Transactions CRUD

**What to build:** Full create/read/update/delete for transactions with amount (sign = type), category, date, and note. User can record income and expenses.

**Blocked by:** 01 (needs categories for category select)

**Status:** ready-for-agent

## Acceptance Criteria

- [ ] Zod schema (`src/lib/schemas/transaction.ts`): amount (number, ≠ 0), categoryId (required), date (YYYY-MM-DD, ≤ today), note (optional, max 255)
- [ ] DB wrapper (`src/lib/db.ts`): transaction CRUD functions with Dexie, index on categoryId
- [ ] Hook (`src/hooks/useTransactions.ts`): state + add/update/delete/refresh, loading/error states
- [ ] Form (`src/components/forms/TransactionForm.tsx`): RHF + Zod, amount input (helper: "Positive = income, Negative = expense"), category select (from useCategories, shows icon+name+color), date picker (default today, max today), note textarea, validation errors
- [ ] List (`src/components/lists/TransactionList.tsx`): table with date, category (icon+name), amount (green income/red expense), note, edit/delete actions, sorted newest first, empty state
- [ ] Page (`src/app/(dashboard)/transactions/page.tsx`): uses hooks, "Add Transaction" button opens form dialog, renders list
- [ ] Unit tests: schema valid/invalid, DB CRUD (fake-indexeddb), hook logic (renderHook)
- [ ] Component tests: Form (validation, submit, prefill, default date), List (empty, render, amount colors, sort, edit/delete)
- [ ] TypeScript strict passes, lint passes
