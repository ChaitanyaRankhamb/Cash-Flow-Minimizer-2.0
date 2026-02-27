'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';

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

interface ExpensesTableProps {
  expenses: Expense[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ExpensesTable({ expenses, onEdit, onDelete }: ExpensesTableProps) {
  return (
    <div className="hidden md:block">
      <Card className="overflow-hidden border border-border bg-card/50 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Expense
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Group
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Paid By
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                  Amount
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                  Your Share
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Date
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
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
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    {expense.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {expense.group}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {expense.paidBy}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                    ${expense.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <span className="text-destructive">${expense.yourShare.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge
                      variant={expense.status === 'settled' ? 'default' : 'secondary'}
                      className={
                        expense.status === 'settled'
                          ? 'bg-success/20 text-success border-success/30'
                          : 'bg-muted text-muted-foreground border-border'
                      }
                    >
                      {expense.status === 'settled' ? 'Settled' : 'Pending'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(expense.id)}
                        className="h-8 w-8 p-0 hover:bg-secondary/50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(expense.id)}
                        className="h-8 w-8 p-0 hover:bg-destructive/10 text-destructive hover:text-destructive"
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
