'use client';

import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface User {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
}

interface Debt {
  from: string;
  to: string;
  amount: number;
}

interface DebtGraphProps {
  users: User[];
  debts: Debt[];
}

export function DebtGraph({ users, debts }: DebtGraphProps) {
  if (users.length === 0) {
    return null;
  }

  // Position users in a circle
  const radius = Math.min(150, 50 + users.length * 15);
  const positions = users.map((_, index) => {
    const angle = (index / users.length) * Math.PI * 2;
    return {
      x: 200 + radius * Math.cos(angle),
      y: 200 + radius * Math.sin(angle),
    };
  });

  return (
    <Card className="overflow-hidden border border-border bg-card/50 backdrop-blur-sm p-6">
      <h3 className="font-semibold text-foreground mb-4">Balance Network Overview</h3>

      <svg width="100%" height="400" viewBox="0 0 400 400" className="mx-auto">
        {/* Draw connections */}
        {debts.map((debt, index) => {
          const fromUser = users.find((u) => u.name === debt.from);
          const toUser = users.find((u) => u.name === debt.to);

          if (!fromUser || !toUser) return null;

          const fromIndex = users.indexOf(fromUser);
          const toIndex = users.indexOf(toUser);

          const fromPos = positions[fromIndex];
          const toPos = positions[toIndex];

          // Scale line thickness based on amount
          const thickness = Math.min(4, 1 + debt.amount / 100);

          return (
            <g key={`debt-${index}`}>
              {/* Connection line */}
              <line
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke="var(--primary)"
                strokeWidth={thickness}
                opacity="0.3"
                strokeDasharray="5,5"
              />
              {/* Arrow direction indicator */}
              <circle
                cx={(fromPos.x + toPos.x) / 2}
                cy={(fromPos.y + toPos.y) / 2}
                r="3"
                fill="var(--primary)"
                opacity="0.5"
              />
            </g>
          );
        })}

        {/* Draw users */}
        {users.map((user, index) => {
          const pos = positions[index];
          return (
            <g key={user.id}>
              {/* User circle background */}
              <circle cx={pos.x} cy={pos.y} r="28" fill="var(--card)" stroke="var(--primary)" strokeWidth="2" />

              {/* User initials */}
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dy="0.3em"
                className="text-xs font-semibold"
                fill="var(--foreground)"
                style={{ pointerEvents: 'none' }}
              >
                {user.initials}
              </text>

              {/* User name */}
              <text
                x={pos.x}
                y={pos.y + 45}
                textAnchor="middle"
                className="text-xs"
                fill="var(--muted-foreground)"
                style={{ pointerEvents: 'none' }}
              >
                {user.name.split(' ')[0]}
              </text>
            </g>
          );
        })}
      </svg>

      <p className="text-xs text-muted-foreground text-center mt-4">
        Line thickness represents settlement amount
      </p>
    </Card>
  );
}
