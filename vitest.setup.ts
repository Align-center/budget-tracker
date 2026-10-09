import '@testing-library/jest-dom';
import { vi, beforeAll, afterAll } from 'vitest';
import React from 'react';

// Make vi globals available for jest-compatible tests
const globalWithVi = globalThis as typeof globalThis & { vi: typeof vi; jest: typeof vi };
globalWithVi.vi = vi;
globalWithVi.jest = vi;

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
}));

// Mock Dexie
vi.mock('dexie', () => {
  return {
    default: class MockDexie {
      version() {
        return this;
      }
      stores() {
        return this;
      }
      on() {
        return this;
      }
    },
    Table: class MockTable {
      add = vi.fn();
      put = vi.fn();
      delete = vi.fn();
      get = vi.fn();
      toArray = vi.fn();
      where() {
        return {
          equalsIgnoreCase: () => ({
            first: vi.fn(),
          }),
        };
      }
      orderBy() {
        return {
          toArray: vi.fn(),
        };
      }
    },
  };
});

// Mock lucide-react icons as React components
const createMockIcon = (name: string) => {
  const MockIcon = ({ className, children, ...props }: React.SVGProps<SVGSVGElement>) =>
    React.createElement(
      'svg',
      {
        'data-testid': `icon-${name.toLowerCase()}`,
        className,
        ...props,
      },
      children
    );
  MockIcon.displayName = name;
  return MockIcon;
};

const iconNames = [
  'Plus',
  'X',
  'ChevronDown',
  'Check',
  'Edit',
  'Trash2',
  'Home',
  'Utensils',
  'ShoppingCart',
  'Car',
  'Briefcase',
  'Heart',
  'GraduationCap',
  'Gamepad2',
  'Plane',
  'Gift',
  'CreditCard',
  'DollarSign',
  'Wallet',
  'Banknote',
  'Coins',
  'PiggyBank',
  'TrendingUp',
  'TrendingDown',
  'ShoppingBag',
  'Receipt',
  'Ticket',
  'Film',
  'Music',
  'Camera',
  'Book',
  'Dumbbell',
  'Coffee',
  'Shirt',
  'Zap',
  'Leaf',
  'Sun',
  'Moon',
  'Cloud',
  'Droplet',
  'Flame',
  'Waves',
  'Mountain',
  'Trees',
  'Flower',
  'Apple',
  'Pizza',
  'Beer',
  'Wine',
  'UtensilsCrossed',
];

const mockExports: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {};
for (const name of iconNames) {
  mockExports[name] = createMockIcon(name);
}

// CATEGORY_ICONS array (same order as in icons.ts) - use the component functions, not strings
const categoryIcons = iconNames.slice(6).map((name) => mockExports[name]);

vi.mock('lucide-react', () => mockExports);

// Mock @/lib/icons to re-export lucide-react mocks
vi.mock('@/lib/icons', () => ({
  ...mockExports,
  CATEGORY_ICONS: categoryIcons,
  ICON_MAP: mockExports,
}));

// Suppress console errors in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
