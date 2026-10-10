import { categoryDb, transactionDb } from '@/lib/db';

describe('Category DB Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  // Since we're using Dexie with IndexedDB, we'll mock the db operations
  // In a real test, you'd use fake-indexeddb

  describe('categoryDb', () => {
    it('should have all required methods', () => {
      expect(typeof categoryDb.getAll).toBe('function');
      expect(typeof categoryDb.getById).toBe('function');
      expect(typeof categoryDb.create).toBe('function');
      expect(typeof categoryDb.update).toBe('function');
      expect(typeof categoryDb.delete).toBe('function');
      expect(typeof categoryDb.nameExists).toBe('function');
    });
  });
});

describe('Transaction DB Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  describe('transactionDb', () => {
    it('should have all required methods', () => {
      expect(typeof transactionDb.getAll).toBe('function');
      expect(typeof transactionDb.getById).toBe('function');
      expect(typeof transactionDb.getByCategoryId).toBe('function');
      expect(typeof transactionDb.create).toBe('function');
      expect(typeof transactionDb.update).toBe('function');
      expect(typeof transactionDb.delete).toBe('function');
    });
  });
});
