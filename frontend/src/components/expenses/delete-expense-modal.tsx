'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

interface DeleteExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expenseName?: string;
  onConfirm: () => Promise<void>;
}

export function DeleteExpenseModal({
  open,
  onOpenChange,
  expenseName = 'this expense',
  onConfirm,
}: DeleteExpenseModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      toast.success('Expense deleted successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to delete expense');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border border-border rounded-2xl shadow-xl backdrop-blur-xl" aria-describedby="delete-expense-description">
        <DialogHeader>
          <DialogTitle className="text-xl">Delete Expense?</DialogTitle>
          <DialogDescription id="delete-expense-description">
            This action cannot be undone. You're about to permanently delete {expenseName}.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
