"use client";

import { useState } from "react";

import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/leftbar";

import { PageHeader } from "@/components/expenses/page-header";
import { StatsCards } from "@/components/expenses/stats-cards";
import { SearchFilterBar } from "@/components/expenses/search-filter-bar";
import { ExpensesTable } from "@/components/expenses/expenses-table";
import { ExpensesCards } from "@/components/expenses/expenses-cards";
import { AddExpenseModal } from "@/components/expenses/add-expense-modal";
import { DeleteExpenseModal } from "@/components/expenses/delete-expense-modal";
import { useAppDataStore } from "@/store/useAppDataStore";
import { ExpenseRow } from "@/components/expenses/expenses-table";

interface SelectedExpense {
  expenseId: string;
  groupId: string;
  expenseName: string;
}

export default function ExpensesPage() {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showDeleteExpense, setShowDeleteExpense] = useState(false);
  const appData = useAppDataStore((s) => s.appData);
  const [selectedExpense, setSelectedExpense] =
    useState<SelectedExpense | null>(null);

  const handleDeleteClick = (expense: SelectedExpense) => {
    setSelectedExpense(expense);
    setShowDeleteExpense(true);
  };

  const expensesData: ExpenseRow[] =
    appData?.groups?.groups.flatMap((group) =>
      group.expenses.expensesList.map((expense) => ({
        id: expense.id,
        name: expense.nameOfExpense,
        groupId: group.id,
        groupName: group.groupName,
        paidBy: expense.paidByUserId,
        amount: expense.totalAmount,
        yourShare: expense.splits.reduce((sum, s) => sum + s.share, 0), // adjust later if needed
        date: expense.createdAt,
        status: "pending",
      }))
    ) ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar />

      <div className="ml-64 flex-1 flex-col overflow-hidden">
        <Header />

        <main className="min-h-screen bg-background">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

            <PageHeader onAddExpenseClick={() => setShowAddExpense(true)} />

            <section className="py-8">
              <StatsCards />
            </section>

            <section className="py-4">
              <SearchFilterBar />
            </section>

            {/* Desktop Table */}
            <section className="py-8">
              <ExpensesTable
                expenses={expensesData}
                onEdit={() => {}}
                onDelete={handleDeleteClick}
              />
            </section>

            {/* Mobile Cards */}
            <section className="py-8">
              <ExpensesCards
                expenses={expensesData}
                onEdit={() => {}}
                onDelete={handleDeleteClick}
              />
            </section>

          </div>

          {/* Add Modal */}
          <AddExpenseModal
            open={showAddExpense}
            onOpenChange={setShowAddExpense}
          />

          {/* Delete Modal */}
          <DeleteExpenseModal
            open={showDeleteExpense}
            onOpenChange={setShowDeleteExpense}
            expenseId={selectedExpense?.expenseId ?? ""}
            groupId={selectedExpense?.groupId ?? ""}
            expenseName={selectedExpense?.expenseName ?? ""}
          />

        </main>
      </div>
    </div>
  );
}