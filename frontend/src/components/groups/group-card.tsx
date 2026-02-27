'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { GroupDetailsPanel } from './group-details-panel';
import { AddMemberModal } from './add-member-modal';

interface GroupCardProps {
  id: string;
  name: string;
  status: 'active' | 'settled' | 'archived';
  totalExpenses: number;
  yourBalance: number;
  lastActivity: string;
  members: Array<{
    name: string;
    avatar: string;
    initials: string;
  }>;
}

export function GroupCard({
  id,
  name,
  status,
  totalExpenses,
  yourBalance,
  lastActivity,
  members,
}: GroupCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success';
      case 'settled':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getBalanceColor = () => {
    if (yourBalance > 0) return 'text-success font-semibold';
    if (yourBalance < 0) return 'text-destructive font-semibold';
    return 'text-muted-foreground';
  };

  return (
    <>
      <Card className="overflow-hidden border border-border bg-card hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer group"
        onClick={() => setShowDetails(true)}
      >
        {/* Header with badge */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>
          </div>
          <Badge className={`ml-2 ${getStatusColor()}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>

        {/* Member avatars */}
        <div className="px-6 pb-4">
          <div className="flex items-center -space-x-2">
            {members.slice(0, 4).map((member, idx) => (
              <Avatar key={idx} className="h-8 w-8 border-2 border-card">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {member.initials}
                </AvatarFallback>
              </Avatar>
            ))}
            {members.length > 4 && (
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs font-medium text-muted-foreground border-2 border-card">
                +{members.length - 4}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3 px-6 py-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Expenses</span>
            <span className="font-semibold text-foreground">${totalExpenses.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Your Balance</span>
            <span className={getBalanceColor()}>
              {yourBalance >= 0 ? '+' : ''} ${Math.abs(yourBalance).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-secondary/30">
          <span className="text-xs text-muted-foreground">{lastActivity}</span>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-primary hover:bg-primary/10"
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(true);
            }}
          >
            View Details
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <GroupDetailsPanel
        open={showDetails}
        onOpenChange={setShowDetails}
        groupId={id}
        groupName={name}
        members={members}
        onAddMemberClick={() => setShowAddMember(true)}
      />

      <AddMemberModal
        open={showAddMember}
        onOpenChange={setShowAddMember}
        groupName={name}
      />
    </>
  );
}
