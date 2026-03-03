'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface PageHeaderProps {
  onCreateGroupClick: () => void;
}

export function PageHeader({ onCreateGroupClick }: PageHeaderProps) {

  
  return (
    <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-primary mb-4">
          Your Groups
        </h1>
        <p className="text-base text-muted-foreground">
          Manage shared expenses and track balances
        </p>
      </div>
      <Button
        size="lg"
        onClick={onCreateGroupClick}
        className="w-full gap-2 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 md:w-auto"
      >
        <Plus className="h-5 w-5" />
        Create Group
      </Button>
    </div>
  );
}
