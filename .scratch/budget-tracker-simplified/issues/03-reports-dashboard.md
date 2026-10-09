# 03: Reports & Dashboard

**What to build:** Dashboard page with two charts — horizontal bar chart (spending by category) and doughnut chart (income vs expense).

**Blocked by:** 02 (needs transactions for report data)

**Status:** ready-for-agent

## Acceptance Criteria

- [ ] Hook (`src/hooks/useReports.ts`): derives from useTransactions — spendingByCategory (expenses grouped by category, summed absolute amounts, joined with category info), incomeVsExpense (sum positive = income, sum absolute negative = expense), memoized, loading/error from transactions
- [ ] Chart setup: Chart.js + react-chartjs-2 installed, SSR-safe dynamic import, shared theme config (tooltips, animations, responsive)
- [ ] SpendingByCategoryChart (`src/components/charts/SpendingByCategoryChart.tsx`): horizontal bar, Y=category name with colored dot, X=amount (currency), bars colored by category.color, tooltips with formatted currency
- [ ] IncomeExpenseChart (`src/components/charts/IncomeExpenseChart.tsx`): doughnut, 2 segments (green #22c55e income, red #ef4444 expense), cutout 60%, center label "Balance: $X.XX", legend bottom, tooltips with amount + percentage
- [ ] Page (`src/app/(dashboard)/page.tsx`): uses useReports, two-section layout, empty states with CTAs when no data, responsive (stacked mobile, side-by-side ≥768px)
- [ ] Unit tests: hook derives correctly from mock transactions
- [ ] Component tests: charts render with props, snapshot test
- [ ] TypeScript strict passes, lint passes
