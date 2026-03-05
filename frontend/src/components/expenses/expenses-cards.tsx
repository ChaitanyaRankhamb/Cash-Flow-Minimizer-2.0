'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
// expense rows are a UI-specific shape, defined in the table component
// so we import that type rather than the backend entity.
import { ExpenseRow } from './expenses-table';

interface ExpensesCardsProps {
  expenses: ExpenseRow[];
  onEdit: (id: string) => void;
  onDelete: (expense: {
    expenseId: string;
    groupId: string;
    expenseName: string;
  }) => void;
}

export function ExpensesCards({
  expenses,
  onEdit,
  onDelete,
}: ExpensesCardsProps) {
  return (
    <div className="md:hidden space-y-3">
      {expenses.map((expense) => (
        <Card
          key={expense.id}
          className="overflow-hidden border border-border bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors"
        >
          <div className="p-4 space-y-3">

            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  {expense.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {expense.groupName}
                </p>
              </div>

              <Badge
                variant={
                  expense.status === 'settled'
                    ? 'default'
                    : 'secondary'
                }
              >
                {expense.status === 'settled'
                  ? 'Settled'
                  : 'Pending'}
              </Badge>
            </div>

            {/* Amount */}
            <div className="space-y-1.5 py-2 border-y border-border/50">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Amount:
                </span>
                <span className="font-semibold text-foreground">
                  ${expense.amount.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Your Share:
                </span>
                <span className="font-semibold text-destructive">
                  ${expense.yourShare.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex justify-between text-xs text-muted-foreground">
              <p>Paid by {expense.paidBy}</p>
              <p>
                {new Date(expense.date).toLocaleDateString()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(expense.id)}
                className="flex-1 gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  onDelete({
                    expenseId: expense.id,
                    groupId: expense.groupId,
                    expenseName: expense.name,
                  })
                }
                className="flex-1 gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>

          </div>
        </Card>
      ))}
    </div>
  );
}