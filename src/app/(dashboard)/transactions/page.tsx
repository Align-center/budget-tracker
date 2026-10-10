'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { TransactionForm } from '@/components/forms/TransactionForm';
import { TransactionList } from '@/components/lists/TransactionList';
import { useTransactions } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import type { TransactionFormData, TransactionInput } from '@/lib/schemas';

export default function TransactionsPage() {
  const { transactions, loading, error, addTransaction, updateTransaction, deleteTransaction } =
    useTransactions();
  const { categories } = useCategories();
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionFormData | null>(null);

  const handleAdd = () => {
    setEditingTransaction(null);
    setShowForm(true);
  };

  const handleEdit = (transaction: TransactionFormData) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleSubmit = async (data: TransactionInput) => {
    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, data);
    } else {
      await addTransaction(data);
    }
    setShowForm(false);
    setEditingTransaction(null);
  };

  const handleDelete = async (id: string) => {
    await deleteTransaction(id);
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Transactions</h1>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Transaction
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      )}

      <TransactionList
        transactions={transactions}
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        loading={loading}
      />

      {showForm && (
        <TransactionForm
          initialData={editingTransaction ?? undefined}
          isEditing={!!editingTransaction}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingTransaction(null);
          }}
        />
      )}
    </div>
  );
}
