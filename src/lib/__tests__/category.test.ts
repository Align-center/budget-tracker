import { categoryInputSchema, categorySchema } from '@/lib/schemas/category';
import type { CategoryInput, CategoryFormData } from '@/lib/schemas/category';

describe('Category Schemas', () => {
  const validCategoryInput: CategoryInput = {
    name: 'Food',
    icon: 'Utensils',
    color: '#FF5733',
    type: 'expense',
  };

  describe('categoryInputSchema', () => {
    it('validates a valid category input', () => {
      const result = categoryInputSchema.safeParse(validCategoryInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validCategoryInput);
      }
    });

    it('rejects empty name', () => {
      const result = categoryInputSchema.safeParse({ ...validCategoryInput, name: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('name');
        expect(result.error.issues[0].message).toContain('required');
      }
    });

    it('rejects name longer than 100 characters', () => {
      const result = categoryInputSchema.safeParse({
        ...validCategoryInput,
        name: 'a'.repeat(101),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('name');
        expect(result.error.issues[0].message).toContain('too long');
      }
    });

    it('accepts name at exactly 100 characters', () => {
      const result = categoryInputSchema.safeParse({
        ...validCategoryInput,
        name: 'a'.repeat(100),
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty icon', () => {
      const result = categoryInputSchema.safeParse({ ...validCategoryInput, icon: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('icon');
        expect(result.error.issues[0].message).toContain('required');
      }
    });

    it('rejects invalid hex color', () => {
      const invalidColors = ['red', '#FF573', '#FF57333', 'FF5733', '#GG5733'];
      invalidColors.forEach((color) => {
        const result = categoryInputSchema.safeParse({ ...validCategoryInput, color });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toContain('color');
        }
      });
    });

    it('accepts valid hex colors', () => {
      const validColors = ['#FF5733', '#000000', '#FFFFFF', '#abcdef', '#ABCDEF', '#123456'];
      validColors.forEach((color) => {
        const result = categoryInputSchema.safeParse({ ...validCategoryInput, color });
        expect(result.success).toBe(true);
      });
    });

    it('rejects invalid type', () => {
      const result = categoryInputSchema.safeParse({ ...validCategoryInput, type: 'invalid' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('type');
      }
    });

    it('accepts both income and expense types', () => {
      const incomeResult = categoryInputSchema.safeParse({ ...validCategoryInput, type: 'income' });
      const expenseResult = categoryInputSchema.safeParse({
        ...validCategoryInput,
        type: 'expense',
      });
      expect(incomeResult.success).toBe(true);
      expect(expenseResult.success).toBe(true);
    });
  });

  describe('categorySchema', () => {
    const validCategory: CategoryFormData = {
      ...validCategoryInput,
      id: '123e4567-e89b-12d3-a456-426614174000',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };

    it('validates a valid full category', () => {
      const result = categorySchema.safeParse(validCategory);
      expect(result.success).toBe(true);
    });

    it('rejects invalid UUID', () => {
      const result = categorySchema.safeParse({ ...validCategory, id: 'invalid-uuid' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('id');
      }
    });

    it('rejects invalid createdAt timestamp', () => {
      const result = categorySchema.safeParse({ ...validCategory, createdAt: 'invalid-date' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('createdAt');
      }
    });

    it('rejects invalid updatedAt timestamp', () => {
      const result = categorySchema.safeParse({ ...validCategory, updatedAt: 'invalid-date' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('updatedAt');
      }
    });
  });
});
