"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";

/* ========= Expense UI Type ========= */

export interface ExpenseRow {
  id: string;
  groupId: string;
  groupName: string;
  name: string;
  paidBy: string;
  amount: number;
  yourShare: number;
  date: string;
  status: "pending" | "settled";
}

/* ========= Props ========= */

interface ExpensesTableProps {
  expenses: ExpenseRow[];
  onEdit: (id: string) => void;
  onDelete: (expense: {
    expenseId: string;
    groupId: string;
    expenseName: string;
  }) => void;
}

/* ========= Component ========= */

export function ExpensesTable({
  expenses,
  onEdit,
  onDelete,
}: ExpensesTableProps) {
  /* ========= Empty ========= */

  if (!expenses.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium text-foreground">No Expenses Found</p>
        <p className="text-sm text-muted-foreground mt-2">
          Add an expense to start tracking payments.
        </p>
      </div>
    );
  }

  /* ========= UI ========= */

  return (
    <div className="hidden md:block">
      <Card className="overflow-hidden border border-border bg-card/50 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Expense
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Group
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Paid By
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold">
                  Amount
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold">
                  Your Share
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Date
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {expenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium">
                    {expense.name}
                  </td>

                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {expense.groupName}
                  </td>

                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {expense.paidBy}
                  </td>

                  <td className="px-6 py-4 text-right text-sm font-semibold">
                    ${expense.amount.toFixed(2)}
                  </td>

                  <td className="px-6 py-4 text-right text-sm font-medium text-destructive">
                    ${expense.yourShare.toFixed(2)}
                  </td>

                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <Badge
                      variant={
                        expense.status === "settled" ? "default" : "secondary"
                      }
                    >
                      {expense.status === "settled" ? "Settled" : "Pending"}
                    </Badge>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(expense.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          onDelete({
                            expenseId: expense.id,
                            groupId: expense.groupId,
                            expenseName: expense.name,
                          })
                        }
                        className="h-8 w-8 p-0 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}