'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight } from 'lucide-react';

interface SettlementCardProps {
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
  onSettle?: (id: string) => void;
}

export function SettlementCard({
  id,
  from,
  to,
  amount,
  group,
  date,
  status,
  onSettle,
}: SettlementCardProps) {
  const isPending = status === 'pending';

  return (
    <Card className="overflow-hidden border border-border bg-card/50 backdrop-blur-sm hover:bg-card/70 hover:scale-[1.02] transition-all duration-200">
      <div className="p-6 space-y-4">
        {/* Top Row: From → To */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="h-10 w-10">
              <AvatarImage src={from.avatar} alt={from.name} />
              <AvatarFallback className="bg-chart-1/20 text-chart-1 font-semibold">
                {from.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">{from.name}</p>
            </div>
          </div>

          <ArrowRight className="h-5 w-5 mx-2 text-muted-foreground flex-shrink-0" />

          <div className="flex items-center gap-3 flex-1 justify-end">
            <div className="min-w-0 text-right flex-1">
              <p className="text-sm font-medium text-foreground truncate">{to.name}</p>
            </div>
            <Avatar className="h-10 w-10">
              <AvatarImage src={to.avatar} alt={to.name} />
              <AvatarFallback className="bg-chart-2/20 text-chart-2 font-semibold">
                {to.initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Middle: Amount and Details */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <p className="text-sm text-muted-foreground">Settlement Amount</p>
            <p className="text-2xl font-bold text-foreground">${amount.toFixed(2)}</p>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-normal border-border">
                {group}
              </Badge>
              <span>ID: {id}</span>
            </div>
          </div>
        </div>

        {/* Bottom: Date and Status/Action */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            Due: {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>

          {isPending ? (
            <Button
              size="sm"
              onClick={() => onSettle?.(id)}
              className="gap-1 bg-primary hover:bg-primary/90 transition-all"
            >
              Mark as Settled
            </Button>
          ) : (
            <Badge className="bg-success/10 text-success border-success/20 border">
              Settled
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
