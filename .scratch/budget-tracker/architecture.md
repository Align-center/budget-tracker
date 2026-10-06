# Budget Tracker - Architecture

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Radix UI + Tailwind CSS 4
- **State**: React Context + useReducer
- **Forms**: React Hook Form + Zod
- **Dates**: date-fns
- **Charts**: Recharts
- **Storage**: IndexedDB (via Dexie.js) with Repository pattern
- **Package Manager**: pnpm

## Patterns

### Repository Pattern

```
TransactionRepository (interface)
  └── IndexedDBTransactionRepository (implementation)
```

Future: `HttpTransactionRepository` for self-hosted sync.

### Context + Reducer Pattern

Each domain has:

- `_repository_` interface + implementation
- `_context_` provider + hook
- `_reducer_` with actions: add, update, delete, setAll

## Data Models

### Transaction

```typescript
interface Transaction {
  id: string;
  amount: number; // positive for income, negative for expense
  categoryId: string;
  date: Date; // ISO string stored
  note?: string;
  venue?: string; // bar/venue name
  createdAt: Date;
  updatedAt: Date;
}
```

### Category

```typescript
interface Category {
  id: string;
  name: string;
  icon: string; // lucide-react icon name
  color: string; // hex color
  isIncome: boolean; // true for income categories
  createdAt: Date;
}
```

### Budget

```typescript
interface Budget {
  id: string;
  categoryId: string;
  amount: number; // monthly limit
  month: string; // YYYY-MM format
}
```

## Key Dependencies

- `dexie` — IndexedDB wrapper
- `react-hook-form` + `@hookform/resolvers` + `zod` — forms
- `date-fns` — date utilities
- `recharts` — charts
- `lucide-react` — icons
- `clsx` + `tailwind-merge` — class utilities
