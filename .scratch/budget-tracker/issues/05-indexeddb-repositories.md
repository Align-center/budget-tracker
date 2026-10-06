# Issue 05: IndexedDB Repository Implementations

## Type: task
## Status: open

## Description
Implement `_repository_` interfaces using `_dexie_` for IndexedDB storage.

## Tasks
- [ ] Implement `IndexedDBTransactionRepository` in `src/lib/repositories/indexeddb/transaction-repository.ts`
- [ ] Implement `IndexedDBCategoryRepository` in `src/lib/repositories/indexeddb/category-repository.ts`
- [ ] Implement `IndexedDBBudgetRepository` in `src/lib/repositories/indexeddb/budget-repository.ts`
- [ ] Add CRUD operations for each entity
- [ ] Add query methods: getByMonth, getByCategory, getDateRange, getSummary

## Acceptance Criteria
- [ ] All CRUD operations work
- [ ] Query methods return correct data
- [ ] Implementations match `_repository_` interfaces exactly