'use client';

import { SettlementCard } from './settlement-card';

interface Settlement {
  id: string;
  from: {
    name: string;
    avatar?: string;
    initials: string;
  };
  to: {
    name: string;
    avatar?: string;
    initials: string;
  };
  amount: number;
  group: string;
  date: string;
  status: 'pending' | 'settled';
}

interface SettlementsListProps {
  settlements: Settlement[];
  onSettle?: (id: string) => void;
}

export function SettlementsList({ settlements, onSettle }: SettlementsListProps) {
  if (settlements.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No settlements to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {settlements.map((settlement) => (
        <SettlementCard
          key={settlement.id}
          {...settlement}
          onSettle={onSettle}
        />
      ))}
    </div>
  );
}
