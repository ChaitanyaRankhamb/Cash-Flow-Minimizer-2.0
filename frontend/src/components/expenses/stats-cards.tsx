'use client';

import { Card } from '@/components/ui/card';
import { useAppDataStore } from '@/store/useAppDataStore';

interface StatCardProps {
  label: string;
  value: string | number;
  type?: 'neutral' | 'success' | 'destructive';
}

function StatCard({ label, value, type = 'neutral' }: StatCardProps) {
  const getColorClasses = () => {
    switch (type) {
      case 'success':
        return 'text-success';
      case 'destructive':
        return 'text-destructive';
      default:
        return 'text-foreground';
    }
  };

  return (
    <Card className="overflow-hidden border border-border bg-card/50 backdrop-blur-sm hover:bg-card/70 hover:scale-105 transition-all duration-200">
      <div className="p-6 space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className={`text-3xl font-bold ${getColorClasses()}`}>{value}</p>
      </div>
    </Card>
  );
}

interface StatsCardsProps {
  totalExpenses?: number;
  youPaid?: number;
  youOwe?: number;
}

export function StatsCards({ totalExpenses = 0, youPaid = 0, youOwe = 0 }: StatsCardsProps) {
  const appData = useAppDataStore((s) => s.appData);
  const expenseData = appData?.expenses.header;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatCard label="Total Expenses" value={`${expenseData?.totalExpenses.toFixed(2)}`} />
      <StatCard label="You Paid" value={`${expenseData?.totalYouPaid.toFixed(2)}`} type="success" />
      <StatCard label="You Owe" value={`${expenseData?.totalYouOwe.toFixed(2)}`} type="destructive" />
    </div>
  );
}
