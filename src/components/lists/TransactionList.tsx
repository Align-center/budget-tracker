'use client';

import { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ICON_MAP } from '@/lib/icons';
import type { TransactionFormData, CategoryFormData } from '@/lib/schemas';
import { TransactionForm } from '@/components/forms/TransactionForm';
import { formatTransactionAmount, getTransactionType } from '@/lib/schemas/transaction';

interface TransactionListProps {
  transactions: TransactionFormData[];
  categories: CategoryFormData[];
  onEdit: (transaction: TransactionFormData) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  loading?: boolean;
}

export function TransactionList({
  transactions,
  categories,
  onEdit,
  onDelete,
  onAdd,
  loading = false,
}: TransactionListProps) {
  const [editingTransaction, setEditingTransaction] = useState<TransactionFormData | null>(null);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            data-testid="loading-skeleton"
            className="h-14 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700"
          />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="py-12 text-center">
        <Plus className="mx-auto mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
        <h3 className="mb-1 text-lg font-medium text-zinc-900 dark:text-zinc-100">
          No transactions yet
        </h3>
        <p className="mb-4 text-zinc-500 dark:text-zinc-400">
          Create your first transaction to start tracking
        </p>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Transaction
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-700">
              <th className="p-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Date</th>
              <th className="p-3 text-left font-medium text-zinc-500 dark:text-zinc-400">
                Category
              </th>
              <th className="p-3 text-right font-medium text-zinc-500 dark:text-zinc-400">
                Amount
              </th>
              <th className="p-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Note</th>
              <th className="p-3 text-right font-medium text-zinc-500 dark:text-zinc-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {transactions.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                categories={categories}
                onEdit={onEdit}
                onDelete={onDelete}
                isEditing={editingTransaction?.id === transaction.id}
              />
            ))}
          </tbody>
        </table>
      </div>

      {editingTransaction && (
        <TransactionForm
          initialData={editingTransaction}
          isEditing
          onSubmit={async (data) => {
            await onEdit({ ...editingTransaction, ...data });
            setEditingTransaction(null);
          }}
          onClose={() => setEditingTransaction(null)}
        />
      )}
    </>
  );
}

function TransactionRow({
  transaction,
  categories,
  onEdit,
  onDelete,
  isEditing,
}: {
  transaction: TransactionFormData;
  categories: CategoryFormData[];
  onEdit: (transaction: TransactionFormData) => void;
  onDelete: (id: string) => void;
  isEditing: boolean;
}) {
  const type = getTransactionType(transaction.amount);
  const isIncome = type === 'income';
  const category = categories.find((c) => c.id === transaction.categoryId);
  const CategoryIcon = category ? ICON_MAP[category.icon] : ICON_MAP.Home;

  const handleDelete = () => {
    if (confirm(`Delete this transaction?`)) {
      onDelete(transaction.id);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <tr
      className={cn(
        'transition-colors',
        isEditing
          ? 'bg-blue-50 dark:bg-blue-900/20'
          : 'bg-white hover:bg-zinc-50 dark:bg-zinc-800/50 dark:hover:bg-zinc-700/50'
      )}
    >
      <td className="p-3 text-zinc-900 dark:text-zinc-100">{formatDate(transaction.date)}</td>
      <td className="p-3">
        <div className="flex items-center gap-2">
          {category ? (
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ backgroundColor: category.color }}
            >
              {CategoryIcon && <CategoryIcon className="h-5 w-5 text-white" />}
            </div>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-300 dark:bg-zinc-600">
              <CategoryIcon className="h-5 w-5 text-white" />
            </div>
          )}
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {category?.name ?? transaction.categoryId}
          </span>
        </div>
      </td>
      <td className="p-3 text-right font-mono">
        <span
          className={cn(
            'font-medium',
            isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          )}
        >
          {formatTransactionAmount(transaction.amount)}
        </span>
      </td>
      <td className="max-w-xs truncate p-3 text-zinc-600 dark:text-zinc-400">
        {transaction.note ?? '—'}
      </td>
      <td className="p-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onEdit(transaction)}
            disabled={isEditing}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
            aria-label="Edit transaction"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isEditing}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            aria-label="Delete transaction"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
