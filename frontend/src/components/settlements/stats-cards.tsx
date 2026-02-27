'use client';

import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  type?: 'neutral' | 'success' | 'destructive';
  icon?: React.ReactNode;
}

function StatCard({ label, value, type = 'neutral', icon }: StatCardProps) {
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
      <div className="p-6 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {icon && <div className="opacity-60">{icon}</div>}
        </div>
        <p className={`text-3xl font-bold ${getColorClasses()}`}>{value}</p>
      </div>
    </Card>
  );
}

interface SettlementStatsCardsProps {
  youOwe?: number;
  youAreOwed?: number;
  netPosition?: number;
}

export function SettlementStatsCards({
  youOwe = 0,
  youAreOwed = 0,
  netPosition = 0,
}: SettlementStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatCard
        label="Total You Owe"
        value={`$${youOwe.toFixed(2)}`}
        type="destructive"
        icon={<TrendingDown className="h-5 w-5" />}
      />
      <StatCard
        label="Total You Are Owed"
        value={`$${youAreOwed.toFixed(2)}`}
        type="success"
        icon={<TrendingUp className="h-5 w-5" />}
      />
      <StatCard
        label="Net Position"
        value={`$${netPosition.toFixed(2)}`}
        type={netPosition >= 0 ? 'success' : 'destructive'}
        icon={netPosition >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
      />
    </div>
  );
}
