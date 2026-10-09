# 04: Navigation & Layout

**What to build:** Top-tab navigation shared across Dashboard, Transactions, and Categories pages with mobile-responsive behavior.

**Blocked by:** 03 (needs all three pages to exist)

**Status:** ready-for-agent

## Acceptance Criteria

- [ ] Layout (`src/app/(dashboard)/layout.tsx`): header with app title "Budget Tracker", top tabs (Dashboard | Transactions | Categories)
- [ ] Tabs component (`src/components/ui/Tabs.tsx`): Radix Tabs primitive, active tab highlighted, keyboard navigation (arrows), ARIA attributes
- [ ] Active tab detection via usePathname, visual indication (underline/background)
- [ ] Mobile responsive: tabs scroll horizontally on narrow screens, or collapse to hamburger menu
- [ ] All three pages use the layout: `/`, `/transactions`, `/categories`
- [ ] No layout shift on navigation
- [ ] Component tests: tabs render, keyboard nav, active state, mobile overflow
- [ ] TypeScript strict passes, lint passes
