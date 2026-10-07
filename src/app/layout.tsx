import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { TransactionProvider } from '@/lib/contexts/TransactionContext';
import { CategoryProvider } from '@/lib/contexts/CategoryContext';
import { BudgetProvider } from '@/lib/contexts/BudgetContext';
import { AppInitializer } from './app-initializer';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Budget Tracker',
  description: 'Track your income, expenses, and budgets',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <TransactionProvider>
          <CategoryProvider>
            <BudgetProvider>
              <AppInitializer>{children}</AppInitializer>
            </BudgetProvider>
          </CategoryProvider>
        </TransactionProvider>
      </body>
    </html>
  );
}
