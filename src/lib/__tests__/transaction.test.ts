import {
  transactionInputSchema,
  transactionSchema,
  getTransactionType,
  formatTransactionAmount,
} from '@/lib/schemas/transaction';
import type { TransactionInput, TransactionFormData } from '@/lib/schemas/transaction';

describe('Transaction Schemas', () => {
  const validTransactionInput: TransactionInput = {
    amount: 50.0,
    categoryId: '123e4567-e89b-12d3-a456-426614174000',
    date: '2024-01-15',
    note: 'Groceries',
  };

  describe('transactionInputSchema', () => {
    it('validates a valid transaction input (income)', () => {
      const result = transactionInputSchema.safeParse({ ...validTransactionInput, amount: 100.0 });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ ...validTransactionInput, amount: 100.0 });
      }
    });

    it('validates a valid transaction input (expense)', () => {
      const result = transactionInputSchema.safeParse({ ...validTransactionInput, amount: -50.0 });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.amount).toBe(-50.0);
      }
    });

    it('rejects zero amount', () => {
      const result = transactionInputSchema.safeParse({ ...validTransactionInput, amount: 0 });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('amount');
        expect(result.error.issues[0].message).toContain('must not be zero');
      }
    });

    it('rejects empty categoryId', () => {
      const result = transactionInputSchema.safeParse({ ...validTransactionInput, categoryId: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('categoryId');
        expect(result.error.issues[0].message).toContain('required');
      }
    });

    it('rejects invalid date format', () => {
      const invalidDates = ['15-01-2024', '2024/01/15', 'Jan 15 2024', 'invalid'];
      invalidDates.forEach((date) => {
        const result = transactionInputSchema.safeParse({ ...validTransactionInput, date });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toContain('date');
        }
      });
    });

    it('rejects future date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const futureDate = tomorrow.toISOString().split('T')[0];

      const result = transactionInputSchema.safeParse({
        ...validTransactionInput,
        date: futureDate,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('date');
        expect(result.error.issues[0].message).toContain('future');
      }
    });

    it('accepts today date', () => {
      const today = new Date().toISOString().split('T')[0];
      const result = transactionInputSchema.safeParse({ ...validTransactionInput, date: today });
      expect(result.success).toBe(true);
    });

    it('accepts past date', () => {
      const result = transactionInputSchema.safeParse({
        ...validTransactionInput,
        date: '2024-01-01',
      });
      expect(result.success).toBe(true);
    });

    it('accepts note within 255 characters', () => {
      const note = 'a'.repeat(255);
      const result = transactionInputSchema.safeParse({ ...validTransactionInput, note });
      expect(result.success).toBe(true);
    });

    it('rejects note longer than 255 characters', () => {
      const note = 'a'.repeat(256);
      const result = transactionInputSchema.safeParse({ ...validTransactionInput, note });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('note');
        expect(result.error.issues[0].message).toContain('too long');
      }
    });

    it('accepts optional note (undefined)', () => {
      const { note, ...inputWithoutNote } = validTransactionInput;
      void note;
      const result = transactionInputSchema.safeParse(inputWithoutNote);
      expect(result.success).toBe(true);
    });

    it('accepts optional note (empty string)', () => {
      const result = transactionInputSchema.safeParse({ ...validTransactionInput, note: '' });
      expect(result.success).toBe(true);
    });
  });

  describe('transactionSchema', () => {
    const validTransaction: TransactionFormData = {
      ...validTransactionInput,
      id: '123e4567-e89b-12d3-a456-426614174001',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };

    it('validates a valid full transaction (income)', () => {
      const result = transactionSchema.safeParse({ ...validTransaction, amount: 100.0 });
      expect(result.success).toBe(true);
    });

    it('validates a valid full transaction (expense)', () => {
      const result = transactionSchema.safeParse({ ...validTransaction, amount: -50.0 });
      expect(result.success).toBe(true);
    });

    it('rejects invalid UUID', () => {
      const result = transactionSchema.safeParse({ ...validTransaction, id: 'invalid-uuid' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('id');
      }
    });

    it('rejects invalid createdAt timestamp', () => {
      const result = transactionSchema.safeParse({
        ...validTransaction,
        createdAt: 'invalid-date',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('createdAt');
      }
    });

    it('rejects invalid updatedAt timestamp', () => {
      const result = transactionSchema.safeParse({
        ...validTransaction,
        updatedAt: 'invalid-date',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('updatedAt');
      }
    });

    it('rejects zero amount in full schema', () => {
      const result = transactionSchema.safeParse({ ...validTransaction, amount: 0 });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('amount');
        expect(result.error.issues[0].message).toContain('must not be zero');
      }
    });
  });

  describe('getTransactionType', () => {
    it('returns income for positive amount', () => {
      expect(getTransactionType(100)).toBe('income');
      expect(getTransactionType(0.01)).toBe('income');
      expect(getTransactionType(1000000)).toBe('income');
    });

    it('returns expense for negative amount', () => {
      expect(getTransactionType(-100)).toBe('expense');
      expect(getTransactionType(-0.01)).toBe('expense');
      expect(getTransactionType(-1000000)).toBe('expense');
    });
  });

  describe('formatTransactionAmount', () => {
    it('formats positive amount with + sign', () => {
      expect(formatTransactionAmount(100)).toBe('+100.00');
      expect(formatTransactionAmount(50.5)).toBe('+50.50');
      expect(formatTransactionAmount(0.01)).toBe('+0.01');
    });

    it('formats negative amount with - sign', () => {
      expect(formatTransactionAmount(-100)).toBe('-100.00');
      expect(formatTransactionAmount(-50.5)).toBe('-50.50');
      expect(formatTransactionAmount(-0.01)).toBe('-0.01');
    });
  });
});
