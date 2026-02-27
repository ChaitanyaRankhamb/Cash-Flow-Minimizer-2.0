'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronDown } from 'lucide-react';

interface HistoryItem {
  id: string;
  from: string;
  to: string;
  amount: number;
  date: string;
  method: string;
}

interface SettlementHistoryProps {
  items: HistoryItem[];
}

export function SettlementHistory({ items }: SettlementHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (items.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden border border-border bg-card/50 backdrop-blur-sm">
      <div
        className="p-6 flex items-center justify-between cursor-pointer hover:bg-card/70 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h3 className="font-semibold text-foreground">Settlement History</h3>
          <p className="text-sm text-muted-foreground">{items.length} settled transactions</p>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </div>

      {isExpanded && (
        <div className="border-t border-border/50">
          <div className="divide-y divide-border/50">
            {items.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">{item.from}</span>
                    <span className="text-xs text-muted-foreground">→</span>
                    <span className="text-sm font-medium text-foreground">{item.to}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <Badge variant="outline" className="font-normal text-xs border-border">
                      {item.method}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">${item.amount.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
