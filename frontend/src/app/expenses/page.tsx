'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/expenses/page-header';
import { StatsCards } from '@/components/expenses/stats-cards';
import { SearchFilterBar } from '@/components/expenses/search-filter-bar';
import { ExpensesTable } from '@/components/expenses/expenses-table';
import { ExpensesCards } from '@/components/expenses/expenses-cards';
import { AddExpenseModal } from '@/components/expenses/add-expense-modal';
import { DeleteExpenseModal } from '@/components/expenses/delete-expense-modal';
import { Header } from '@/components/dashboard/header';
import { Sidebar } from '@/components/leftbar';

interface Expense {
  id: string;
  name: string;
  group: string;
  paidBy: string;
  amount: number;
  yourShare: number;
  date: string;
  status: 'settled' | 'pending';
}

// Mock data
const MOCK_EXPENSES: Expense[] = [
  {
    id: '1',
    name: 'Dinner at Mario\'s',
    group: 'Dinner Club',
    paidBy: 'Charlie Brown',
    amount: 120.50,
    yourShare: 30.13,
    date: '2024-02-25',
    status: 'pending',
  },
  {
    id: '2',
    name: 'Hotel booking',
    group: 'Summer Trip',
    paidBy: 'Alice Johnson',
    amount: 450.00,
    yourShare: 112.50,
    date: '2024-02-24',
    status: 'pending',
  },
  {
    id: '3',
    name: 'Groceries',
    group: 'Apartment Rent',
    paidBy: 'Bob Smith',
    amount: 85.75,
    yourShare: 42.88,
    date: '2024-02-23',
    status: 'settled',
  },
  {
    id: '4',
    name: 'Gas for road trip',
    group: 'Summer Trip',
    paidBy: 'You',
    amount: 65.00,
    yourShare: 0.00,
    date: '2024-02-22',
    status: 'pending',
  },
  {
    id: '5',
    name: 'Movie tickets',
    group: 'Dinner Club',
    paidBy: 'Diana Prince',
    amount: 40.00,
    yourShare: 13.33,
    date: '2024-02-21',
    status: 'settled',
  },
];

export default function ExpensesPage() {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>({});

  const selectedExpense = expenses.find((e) => e.id === selectedExpenseId);

  // Calculate stats
  const stats = useMemo(() => {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const yourOwe = expenses.reduce((sum, e) => sum + e.yourShare, 0);
    const youArePaid = expenses
      .filter((e) => e.paidBy === 'You')
      .reduce((sum, e) => sum + e.amount, 0);

    return { total, yourOwe, youArePaid };
  }, [expenses]);

  // Filter and sort expenses
  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

    // Text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(query) ||
          e.group.toLowerCase().includes(query) ||
          e.paidBy.toLowerCase().includes(query)
      );
    }

    // Group filter
    if (selectedGroup) {
      result = result.filter((e) => e.group === selectedGroup);
    }

    // Status filter
    if (selectedStatus) {
      result = result.filter((e) => e.status === selectedStatus);
    }

    // Date range filter
    if (dateRange.from) {
      result = result.filter((e) => e.date >= dateRange.from!);
    }
    if (dateRange.to) {
      result = result.filter((e) => e.date <= dateRange.to!);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'highest') return b.amount - a.amount;
      if (sortBy === 'lowest') return a.amount - b.amount;
      return 0;
    });

    return result;
  }, [expenses, searchQuery, selectedGroup, selectedStatus, dateRange, sortBy]);

  const handleAddExpense = (newExpense: Omit<Expense, 'id'>) => {
    const id = Math.random().toString(36).slice(2, 11);
    setExpenses((prev) => [{ ...newExpense, id }, ...prev]);
  };

  const handleEdit = (id: string) => {
    // In a real app, open an edit modal with pre-filled data
    console.log('[v0] Edit expense:', id);
  };

  const handleDeleteClick = (id: string) => {
    setSelectedExpenseId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedExpenseId) {
      setExpenses((prev) => prev.filter((e) => e.id !== selectedExpenseId));
      setSelectedExpenseId(null);
    }
  };

  // Get unique groups for filter
  const groups = Array.from(new Set(expenses.map((e) => e.group)));

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar already uses sidebar tokens */}
      <Sidebar />

      <div className="ml-64 flex-1 flex-col overflow-hidden">
        {/* Header should use bg-card + border-border internally */}
        <Header />

        <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <PageHeader onAddExpenseClick={() => setShowAddExpense(true)} />

        {/* Stats Cards with live data */}
        <section className="py-8">
          <StatsCards
            totalExpenses={stats.total}
            youPaid={stats.youArePaid}
            youOwe={stats.yourOwe}
          />
        </section>

        {/* Search and Filter Bar */}
        <section className="py-4">
          <SearchFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedGroup={selectedGroup}
            onGroupChange={setSelectedGroup}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            sortBy={sortBy}
            onSortChange={setSortBy}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            groups={groups}
          />
        </section>

        {/* Expenses Table (Desktop) */}
        <section className="py-8">
          <ExpensesTable
            expenses={filteredExpenses}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </section>

        {/* Expenses Cards (Mobile) */}
        <section className="py-8">
          <ExpensesCards
            expenses={filteredExpenses}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </section>
      </div>

      {/* Add Expense Modal */}
      <AddExpenseModal
        open={showAddExpense}
        onOpenChange={setShowAddExpense}
        onAddExpense={handleAddExpense}
      />

      {/* Delete Expense Modal */}
      <DeleteExpenseModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        expenseName={selectedExpense?.name}
        onConfirm={handleDeleteConfirm}
      />
    </main>
      </div>
    </div>
    
  );
}
