# Issue 04: Repository Interfaces

## Type: task
## Status: open

## Description
Define `_repository_` interfaces for the Repository pattern to enable swappable storage.

## Tasks
- [ ] Create `src/lib/repositories/transaction-repository.ts` — `_repository_` interface
- [ ] Create `src/lib/repositories/category-repository.ts` — `_repository_` interface
- [ ] Create `src/lib/repositories/budget-repository.ts` — `_repository_` interface
- [ ] Create `src/lib/repositories/index.ts` — barrel export

## Acceptance Criteria
- [ ] `_repository_` interfaces define all needed CRUD operations
- [ ] Query methods included (getByMonth, getByCategory, getDateRange, getSummary)
- [ ] Barrel export works