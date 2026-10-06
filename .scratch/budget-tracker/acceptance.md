# Budget Tracker - Acceptance Criteria

## Core Features

- [ ] User can create/edit/delete custom categories with icons and colors
- [ ] User can add/edit/delete transactions with amount, category, date, note, venue
- [ ] User can set monthly budgets per category (calendar month)
- [ ] Reports show: spending by category (bar chart), trends over time (line chart), budget vs actual, income vs expense
- [ ] Data persists in IndexedDB across sessions

## Technical

- [ ] `_repository_` pattern implemented — storage can be swapped
- [ ] TypeScript strict mode passes
- [ ] ESLint + Prettier pass
- [ ] All `_form_` validate with Zod
- [ ] Responsive design works on mobile/desktop

## Future Enhancements (Post-v1)

- Recurring transactions
- Multiple accounts
- Data export/import (CSV, JSON)
- Dark mode
- Self-hosted sync backend
- Budget alerts/notifications
- Category groups/hierarchy
- Tags for transactions
