/**
 * IndexedDB Repository implementations barrel export
 * Import implementations from here for dependency injection
 */

export {
  indexedDBTransactionRepository,
  type IndexedDBTransactionRepository,
} from './transaction-repository';
export {
  indexedDBCategoryRepository,
  type IndexedDBCategoryRepository,
} from './category-repository';
export { indexedDBBudgetRepository, type IndexedDBBudgetRepository } from './budget-repository';
