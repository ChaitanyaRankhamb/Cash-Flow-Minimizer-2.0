'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Edit2, Plus } from 'lucide-react';

interface GroupDetailsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  groupName: string;
  members: Array<{
    name: string;
    avatar: string;
    initials: string;
  }>;
  onAddMemberClick?: () => void;
}

export function GroupDetailsPanel({
  open,
  onOpenChange,
  groupId,
  groupName,
  members,
  onAddMemberClick,
}: GroupDetailsPanelProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        {/* Header */}
        <SheetHeader className="space-y-4 pb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <SheetTitle className="text-2xl">{groupName}</SheetTitle>
              <Badge className="w-fit">Active</Badge>
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Members section in header */}
          <div className="space-y-3 pt-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Members ({members.length})</h3>
            <div className="flex flex-wrap gap-2">
              {members.map((member, idx) => (
                <div key={idx} className="flex items-center gap-2 rounded-full bg-secondary/50 px-3 py-1.5">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{member.name}</span>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={onAddMemberClick}
                className="rounded-full gap-1 h-auto px-3 py-1.5 border-dashed hover:bg-secondary/50 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span className="text-sm">Add</span>
              </Button>
            </div>
          </div>
        </SheetHeader>

        <Separator className="my-6" />

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-secondary/30">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="settlements">Settlements</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="space-y-3">
              <Card className="p-4 bg-card/50 border-border">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-3xl font-bold text-foreground">$3,240</p>
                </div>
              </Card>
              <Card className="p-4 bg-card/50 border-border">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Your Net Balance</p>
                  <p className="text-3xl font-bold text-success">+$420</p>
                </div>
              </Card>
            </div>

            {/* Recent Transactions */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Recent Transactions</h3>
              <div className="space-y-2">
                {[
                  { date: 'Today', description: 'Dinner paid by Sarah', amount: '-$45', participant: 'Sarah' },
                  { date: 'Yesterday', description: 'Coffee paid by you', amount: '+$12', participant: 'You' },
                  { date: '2 days ago', description: 'Gas paid by Mike', amount: '-$28', participant: 'Mike' },
                  { date: '3 days ago', description: 'Hotel paid by you', amount: '+$320', participant: 'You' },
                  { date: '4 days ago', description: 'Groceries paid by Emma', amount: '-$87', participant: 'Emma' },
                ].map((tx, idx) => (
                  <Card key={idx} className="p-3 bg-secondary/20 border-border hover:bg-secondary/40 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 space-y-0.5">
                        <p className="text-xs text-muted-foreground">{tx.date}</p>
                        <p className="text-sm font-medium text-foreground">{tx.description}</p>
                      </div>
                      <span className={`text-sm font-semibold ${
                        tx.amount.startsWith('+') ? 'text-success' : 'text-destructive'
                      }`}>
                        {tx.amount}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Expenses Tab */}
          <TabsContent value="expenses" className="space-y-4">
            <div className="space-y-2">
              {[
                { description: 'Hotel accommodation', amount: 320, paidBy: 'You' },
                { description: 'Restaurant dinner', amount: 156, paidBy: 'Sarah' },
                { description: 'Gas & transportation', amount: 89, paidBy: 'Mike' },
                { description: 'Groceries & supplies', amount: 127, paidBy: 'Emma' },
              ].map((expense, idx) => (
                <Card key={idx} className="p-4 bg-card/50 border-border hover:bg-card/70 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-foreground">{expense.description}</p>
                      <p className="text-xs text-muted-foreground">Paid by {expense.paidBy}</p>
                    </div>
                    <span className="text-base font-semibold text-foreground">${expense.amount}</span>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settlements Tab */}
          <TabsContent value="settlements" className="space-y-4">
            <div className="space-y-2">
              {[
                { from: 'You', to: 'Sarah', amount: 45 },
                { from: 'Mike', to: 'You', amount: 28 },
                { from: 'Emma', to: 'You', amount: 87 },
              ].map((settlement, idx) => (
                <Card key={idx} className="p-4 bg-card/50 border-border">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {settlement.from} pays {settlement.to}
                      </p>
                    </div>
                    <span className="font-semibold text-success">${settlement.amount}</span>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
