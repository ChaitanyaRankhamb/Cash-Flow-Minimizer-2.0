'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface PageHeaderProps {
  onAddExpenseClick: () => void;
}

export function PageHeader({ onAddExpenseClick }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-primary mb-4">
          Expenses
        </h1>
        <p className="text-base text-muted-foreground">
          Track and manage shared expenses
        </p>
      </div>
      <Button
        size="lg"
        onClick={onAddExpenseClick}
        className="w-full gap-2 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 md:w-auto"
      >
        <Plus className="h-5 w-5" />
        Add Expense
      </Button>
    </div>
  );
}
