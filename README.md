# Budget Tracker

A personal expense tracker built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS 4**, **Dexie.js (IndexedDB)**, and **Chart.js** — developed iteratively with LLM assistance using a structured issue-tracking workflow.

---

## 🎯 Project Overview

This project demonstrates how to use LLMs (specifically Claude Code) as a collaborative development partner through:

1. **Structured issue tracking** — Local markdown files in `.scratch/` serving as the single source of truth
2. **Agent skills** — Reusable workflows for planning, TDD, code review, debugging, and more
3. **Iterative, branch-per-feature workflow** — Each issue maps to a branch, PR, and review cycle
4. **LLM-guided implementation** — The human architects; the LLM implements, tests, and refactors

---

## 🏗️ Architecture Decisions (Human-Guided)

| Decision                       | Rationale                                     |
| ------------------------------ | --------------------------------------------- |
| **Next.js App Router**         | Modern React framework with server components |
| **Dexie.js + IndexedDB**       | Local-first persistence, no backend needed    |
| **React Hook Form + Zod**      | Type-safe forms with runtime validation       |
| **Chart.js + react-chartjs-2** | Lightweight, performant charts                |
| **Radix UI + Tailwind 4**      | Accessible primitives, utility-first styling  |
| **Custom hooks (no Context)**  | Direct DB access, simpler mental model        |
| **Vitest + Playwright**        | Fast unit tests + real-browser E2E            |

> **Note**: The project evolved from an over-engineered "repository pattern + Context + Reducer + Budgets" design to a simplified "direct DB hooks + two charts" architecture. See [`.scratch/budget-tracker-simplified/spec.md`](.scratch/budget-tracker-simplified/spec.md) for the simplification rationale.

---

## 📋 Issue Tracking Workflow

> ⚠️ **Important**: This project has **two** issue directories in `.scratch/`:
>
> | Directory                             | Status       | Description                                                                                                                 |
> | ------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------- |
> | `.scratch/budget-tracker/`            | **ARCHIVED** | Original 28-issue horizontal-layer plan (over-engineered: repository pattern, Context+Reducer, budgets, 4 charts, 3 tables) |
> | `.scratch/budget-tracker-simplified/` | **ACTIVE**   | Current 6-issue vertical-slice plan (tracer bullets: Categories → Transactions → Reports → Nav → E2E → Cleanup)             |
>
> The active work is in **`.scratch/budget-tracker-simplified/`**. The archived version is kept for reference.

### Active Issue Structure (`.scratch/budget-tracker-simplified/`)

```
.scratch/budget-tracker-simplified/
├── spec.md           # Simplified architecture spec (source of truth)
├── map.md            # Effort map with vertical slices + dependency chain
└── issues/
    ├── 01-categories-crud.md      # Categories CRUD (name, icon, color)
    ├── 02-transactions-crud.md    # Transactions CRUD (amount, category, date, note)
    ├── 03-reports-dashboard.md    # Reports & Dashboard (2 charts)
    ├── 04-navigation-layout.md    # Navigation & Layout (top tabs)
    ├── 05-e2e-tests.md            # E2E Tests (5 critical flows)
    └── 06-cleanup.md              # Cleanup (remove old architecture)
```

### Issue File Structure (Simplified)

Each issue is a **vertical slice** (tracer bullet) cutting through schema → DB → hook → UI → tests:

```markdown
# NN: Title

**What to build:** One-sentence user-facing feature description

**Blocked by:** Issue numbers this depends on (or "None")

**Status:** ready-for-agent | claimed | resolved

## Acceptance Criteria

- [ ] Schema, DB, Hook, Form, List, Page — each with specific deliverables
- [ ] Unit tests: schema, DB (fake-indexeddb), hook (renderHook)
- [ ] Component tests: Form (validation, submit, prefill), List (empty, render, actions)
- [ ] TypeScript strict passes, lint passes
```

### The Effort Map (`.scratch/budget-tracker-simplified/map.md`)

Vertical slices with explicit dependency chain:

```markdown
## Dependency Chain

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

## Key Principles

- Each slice includes its own tests (unit + component co-located)
- E2E is separate (cross-cutting, runs on merge)
- Cleanup last (removes old architecture after new is verified)
- No horizontal slices (no "schemas only", "DB only", "hooks only" tickets)
```

### Archived Issues (`.scratch/budget-tracker/issues/`)

The original 28 issues (kept for history):

```
01-project-setup          09-ui-primitives       17-budget-list
02-types-and-schemas      10-layout-components   18-budget-form
03-indexeddb-setup        11-category-list       19-budget-page
04-repository-interfaces  12-category-form       20-report-utils
05-indexeddb-repositories 13-category-page       21-report-charts
06-context-providers      14-transaction-list    22-report-tables
07-reducers               15-transaction-form    23-reports-page
08-initialize-app-state   16-transaction-page    24-dashboard-page
                                                    25-navigation-and-routing
                                                    26-theme-and-styling
                                                    27-error-boundaries-and-loading
                                                    28-data-export
```

> These were organized as **horizontal layers** (foundation → state → ui-core → categories → transactions → budgets → reports → polish) — which led to over-engineering. The simplified approach uses **vertical slices** instead.

---

## 🤖 Agent Skills Configuration

The project uses **Claude Code agent skills** (defined in `AGENTS.md` and `.claude/`) to standardize LLM interactions:

| Skill                        | Purpose                                                              |
| ---------------------------- | -------------------------------------------------------------------- |
| `issue-tracker`              | Create, read, update issue files in `.scratch/`                      |
| `triage-labels`              | Standardized status labels (`needs-triage`, `ready-for-agent`, etc.) |
| `domain`                     | Single-context docs: `CONTEXT.md` + `docs/adr/`                      |
| `committing-with-commitlint` | Conventional commits, no body/footer                                 |
| `code-review`                | Automated correctness + quality reviews                              |
| `tdd`                        | Test-first implementation cycles                                     |
| `diagnosing-bugs`            | Systematic debugging workflow                                        |
| `prototype`                  | Rapid exploration before committing                                  |
| `research`                   | Deep-dive investigation tasks                                        |

**Example usage in conversation:**

> "Work on issue 11 (category list) using the TDD skill"
> "Review the current diff with code-review skill at high level"
> "Create a prototype for the chart component first"

---

## 🔄 Development Loop (How We Worked Together)

### 1. **Planning & Specification** (Human)

- Define the problem, scope, and acceptance criteria in `.scratch/`
- Create the effort map showing workstream dependencies
- Break work into 6 vertical slices (simplified) or 28 atomic issues (original)

### 2. **Issue Claiming** (Human → LLM)

```
Human: "Start issue 03 (IndexedDB setup)"
LLM: Reads issue, sets `Status: claimed`, creates branch `feat/issue-03-indexeddb-setup`
```

### 3. **Implementation** (LLM with Human Guidance)

- LLM implements following the issue's task list
- Uses relevant skills (TDD for new code, prototype for exploration)
- Runs `pnpm lint`, `pnpm type-check`, `pnpm format` before commit
- Human reviews, asks for changes, or approves

### 4. **Code Review** (LLM → Human)

```
Human: "Review this PR with code-review skill"
LLM: Runs automated review, reports findings by severity
Human: Approves or requests fixes
```

### 5. **Merge & Iterate** (Human)

- Squash-merge PR to main
- Update issue `Status: resolved`
- Append decisions to `map.md` (Decisions-so-far)
- Move to next unblocked issue

### 6. **Architecture Evolution** (Human Decision)

- Mid-project: Realized repository pattern + Context was over-engineered
- Created `.scratch/budget-tracker-simplified/spec.md` as new north star
- Refactored incrementally through subsequent issues

---

## 🌿 Git Workflow

```
main
  │
  ├── feat/issue-01-project-setup      → PR #1  → merged
  ├── feat/issue-02-types-and-schemas  → PR #2  → merged
  ├── feat/issue-03-indexeddb-setup    → PR #3  → merged
  ├── feat/issue-04-repository-interfaces
  ├── feat/issue-05-indexeddb-repositories
  ├── feat/issue-06-context-providers
  ├── feat/issue-07-reducers
  ├── feat/issue-08-initialize-app-state
  ├── feat/issue-09-ui-primitives
  ├── feat/issue-10-layout-components
  ├── feat/issue-11-category-list      → PR #9  → merged
  ├── feat/issue-12-category-form
  ├── feat/issue-13-category-page
  ├── feat/issue-14-transaction-list   → PR #11 → merged
  ├── feat/issue-15-transaction-form
  ├── feat/issue-16-transaction-page
  ├── feat/issue-17-budget-list
  ├── feat/issue-18-budget-form
  ├── feat/issue-19-budget-page
  ├── feat/issue-20-report-utils       → PR #12 → merged
  ├── feat/issue-21-report-charts
  ├── feat/issue-22-report-tables
  ├── feat/issue-23-reports-page
  ├── feat/issue-24-dashboard-page
  ├── feat/issue-25-navigation-and-routing
  ├── feat/issue-26-theme-and-styling
  ├── feat/issue-27-error-boundaries-and-loading
  └── feat/issue-28-data-export        → PR #13 → merged
```

**Commit convention:** `type(scope): description` (enforced by commitlint + husky)

---

## 🧪 Quality Gates (Every Commit)

```bash
pnpm lint        # ESLint
pnpm format      # Prettier (with Tailwind plugin)
pnpm type-check  # tsc --noEmit
pnpm test        # Vitest unit + component tests
pnpm test:e2e    # Playwright E2E tests (on merge)
```

**CI Pipeline** (`.github/workflows/ci.yml`):

- Parallel jobs: lint → type-check → format-check → test
- Build runs only after all checks pass
- Node 24, pnpm 9.12.2, cached dependencies

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (dashboard)/           # Route group with top nav
│   │   ├── layout.tsx         # Shell + navigation tabs
│   │   ├── page.tsx           # Dashboard (charts)
│   │   ├── categories/page.tsx
│   │   └── transactions/page.tsx
│   ├── globals.css
│   └── layout.tsx
├── lib/
│   ├── db.ts                  # Dexie wrapper + typed CRUD
│   ├── schemas/
│   │   ├── category.ts        # Zod schema + inferred types
│   │   └── transaction.ts
│   ├── utils.ts               # Date formatting, currency helpers
│   └── icons.ts               # Curated lucide-react icon map
├── hooks/
│   ├── useCategories.ts       # State + DB calls for categories
│   ├── useTransactions.ts     # State + DB calls for transactions
│   └── useReports.ts          # Derived analytics from transactions
├── components/
│   ├── ui/                    # Radix + Tailwind primitives
│   ├── forms/
│   │   ├── CategoryForm.tsx
│   │   └── TransactionForm.tsx
│   ├── lists/
│   │   ├── CategoryList.tsx
│   │   └── TransactionList.tsx
│   └── charts/
│       ├── SpendingByCategoryChart.tsx  # Horizontal bar
│       ├── IncomeExpenseChart.tsx       # Doughnut
│       ├── chartTheme.ts                # Shared Chart.js config
│       └── init.ts                      # Chart.js registration
└── types/                     # (removed — types inferred from Zod)
```

---

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run quality checks
pnpm lint
pnpm type-check
pnpm format:check

# Run tests
pnpm test           # Unit + component
pnpm test:e2e       # Playwright E2E
pnpm test:e2e:ui    # Playwright with UI
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📚 Key Learnings: LLM as Development Partner

### What Worked Well

- **Explicit issue files** → LLM never "forgot" context between sessions
- **Atomic issues** → Each PR was reviewable, testable, revertible
- **Skill system** → Consistent workflows (TDD, code review, debugging)
- **Human as architect** → LLM excels at implementation, not high-level decisions
- **Local markdown tracker** → No external tool dependency, git-tracked

### What Required Human Intervention

- Architecture pivots (simplification decision)
- UX/design decisions (color picker, icon grid, empty states)
- Trade-off calls (Chart.js vs Recharts, hook vs Context)
- Priority ordering when multiple issues unblocked

### Anti-Patterns to Avoid

- ❌ Asking LLM to "build the whole app" in one prompt
- ❌ Skipping issue files → context loss, scope creep
- ❌ Accepting code without running quality gates
- ❌ Letting LLM invent requirements not in the spec

---

## 📖 Further Reading

- [Issue Tracker Convention](docs/agents/issue-tracker.md)
- [Triage Labels](docs/agents/triage-labels.md)
- [Domain Documentation Pattern](docs/agents/domain.md)
- [Simplified Architecture Spec](.scratch/budget-tracker-simplified/spec.md)
- [Original Architecture](.scratch/budget-tracker/architecture.md)

---

## 🤝 Attribution

This project was built collaboratively with **Claude Code** (Anthropic's CLI for Claude).

- Issues, architecture, and decisions: **Human**
- Implementation, tests, refactoring, CI: **LLM-assisted**
- Code review & quality enforcement: **LLM + Human**

---

_Generated with [Claude Code](https://claude.com/claude-code)_
