# 05: E2E Tests

**What to build:** 5 Playwright E2E tests covering critical user flows, running on merge to main.

**Blocked by:** 04 (needs full app navigable)

**Status:** ready-for-agent

## Acceptance Criteria

- [ ] Playwright configured (`playwright.config.ts`): chromium/firefox/webkit, mobile viewport project (375x667), trace/screenshot on failure
- [ ] Flow 1: Create category → create transaction → verify on dashboard
  - Add category "Food" (utensils, #FF5733)
  - Add transaction -25.50, Food, today, "Lunch"
  - Dashboard shows "Food: $25.50" in bar chart, expense $25.50 in doughnut
- [ ] Flow 2: Edit transaction → verify update
  - Add transaction -10.00, Transport, "Bus"
  - Edit to -15.00, "Bus + subway"
  - List and dashboard reflect new total
- [ ] Flow 3: Delete category with transactions → blocked
  - Add category "Entertainment", add transaction
  - Try delete category → blocked with message (cascade not implemented)
- [ ] Flow 4: Switch tabs → verify persistence
  - Add data, navigate Dashboard → Transactions → Categories → Dashboard
  - Refresh page → data persists (IndexedDB)
- [ ] Flow 5: Mobile viewport (375x667)
  - All 3 pages usable, no horizontal scroll
  - Tabs scrollable/hamburger works
  - Forms fit, charts readable
- [ ] Tests run in CI on merge (`pnpm test:e2e`), no flaky tests, data cleaned between tests
