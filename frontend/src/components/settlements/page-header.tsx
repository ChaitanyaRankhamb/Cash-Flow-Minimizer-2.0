'use client';

import { Button } from '@/components/ui/button';
import { Download, CheckCircle2 } from 'lucide-react';

interface PageHeaderProps {
  onSettleAllClick: () => void;
  onExportClick: () => void;
  hasPending: boolean;
}

export function PageHeader({ onSettleAllClick, onExportClick, hasPending }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-primary mb-4">
          Settlements
        </h1>
        <p className="text-base text-muted-foreground">
          Clear balances and simplify transactions
        </p>
      </div>
      <div className="flex flex-col gap-3 w-full md:w-auto md:flex-row">
        <Button
          onClick={onSettleAllClick}
          disabled={!hasPending}
          className="gap-2 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircle2 className="h-5 w-5" />
          Settle All
        </Button>
        <Button
          variant="ghost"
          onClick={onExportClick}
          className="gap-2 hover:bg-secondary/50 transition-colors"
        >
          <Download className="h-5 w-5" />
          Export Report
        </Button>
      </div>
    </div>
  );
}
