"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Edit2, Plus } from "lucide-react";
import { StoreGroup } from "./groups-grid";
import { useAppDataStore } from "@/store/useAppDataStore";

interface GroupDetailsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupData: StoreGroup;
  members: Array<{
    name: string;
    avatar: string;
    initials: string;
  }>;
  onAddMemberClick?: () => void;
}

export interface Expense {
  id: string;
  nameOfExpense: string;
  paidByUserId: string;
  totalAmount: number;
  createdAt: string; // ISO date string
  splits: ExpenseSplit[];
}

export interface Expenses {
  expensesList: Expense[];
}

export interface ExpenseSplit {
  userId: string;
  share: number;
}

export function GroupDetailsPanel({
  open,
  onOpenChange,
  groupData,
  members,
  onAddMemberClick,
}: GroupDetailsPanelProps) {
  const { groupName, groupStatus, overview, expenses } = groupData;
  const appData = useAppDataStore((s) => s.appData);

  // helper to translate user id into display name (including "You")
  const lookupUserName = (id: string) => {
    if (id === appData?.dashboard.user.id) return "You";
    for (const g of appData?.groups.groups || []) {
      const m = g.members.find((m) => m.userId === id);
      if (m) return m.username;
    }
    return id;
  };

  const recentList = overview?.recentTransctionList ?? [];
  const expensesList: Expense[] = groupData.expenses?.expensesList ?? [];
  const suggestionsList = groupData.suggestions?.listOfSuggestions ?? [];

  const getStatusColor = () => {
    switch (groupStatus) {
      case "active":
        return "bg-success/10 text-success";
      case "balanced":
      case "settled":
        return "bg-muted text-muted-foreground";
      case "archived":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getBalanceColor = () => {
    const balance = overview?.yourNetBalance ?? 0;
    if (balance > 0) return "text-success";
    if (balance < 0) return "text-destructive";
    return "text-muted-foreground";
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        {/* Header */}
        <SheetHeader className="space-y-4 pb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <SheetTitle className="text-2xl">{groupName}</SheetTitle>
              <Badge className={`w-fit ${getStatusColor()}`}>
                {groupStatus.charAt(0).toUpperCase() + groupStatus.slice(1)}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Members section in header */}
          <div className="space-y-3 pt-4">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Members ({members.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {members.map((member, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-full bg-secondary/50 px-3 py-1.5"
                >
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
                  <p className="text-sm text-muted-foreground">
                    Total Expenses
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    ${(overview?.totalExpensesAmount ?? 0).toLocaleString()}
                  </p>
                </div>
              </Card>
              <Card className="p-4 bg-card/50 border-border">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Your Net Balance
                  </p>
                  <p className={`text-3xl font-bold ${getBalanceColor()}`}>
                    {(overview?.yourNetBalance ?? 0) >= 0 ? "+" : ""}$
                    {Math.abs(overview?.yourNetBalance ?? 0).toLocaleString()}
                  </p>
                </div>
              </Card>
            </div>

            {/* Recent Transactions */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">
                Recent Transactions
              </h3>
              <div className="space-y-2">
                {recentList.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No recent transactions
                  </p>
                ) : (
                  recentList.map((tx, idx) => {
                    const date =
                      typeof tx.timeOfpaid === "string"
                        ? new Date(tx.timeOfpaid)
                        : tx.timeOfpaid;
                    const amount = tx.amount;
                    const isPositive = amount >= 0;
                    return (
                      <Card
                        key={idx}
                        className="p-3 bg-secondary/20 border-border hover:bg-secondary/40 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 space-y-0.5">
                            <p className="text-xs text-muted-foreground">
                              {date.toLocaleDateString()}
                            </p>
                            <p className="text-sm font-medium text-foreground">
                              {tx.transactionName}
                            </p>
                          </div>
                          <span
                            className={`text-sm font-semibold ${isPositive ? "text-success" : "text-destructive"}`}
                          >
                            {isPositive ? "+" : "-"}$
                            {Math.abs(amount).toLocaleString()}
                          </span>
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          </TabsContent>

          {/* Expenses Tab */}
          <TabsContent value="expenses" className="space-y-4">
            <div className="space-y-2">
              {expensesList.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No expenses recorded
                </p>
              ) : (
                expensesList.map((expense: Expense, idx) => {
                  const payer = lookupUserName(expense.paidByUserId);
                  return (
                    <Card
                      key={idx}
                      className="p-4 bg-card/50 border-border hover:bg-card/70 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium text-foreground">
                            {expense.nameOfExpense}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Paid by {payer}
                          </p>
                        </div>
                        <span className="text-base font-semibold text-foreground">
                          ${expense.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* Settlements Tab */}
          <TabsContent value="settlements" className="space-y-4">
            <div className="space-y-2">
              {suggestionsList.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No settlements recorded
                </p>
              ) : (
                suggestionsList.map((suggestion, idx) => {
                  const fromName = lookupUserName(
                    (suggestion as any).fromUserId ||
                      (suggestion as any).who ||
                      "",
                  );
                  const toName = lookupUserName(
                    (suggestion as any).toUserId ||
                      (suggestion as any).whom ||
                      "",
                  );
                  const dateStr = (suggestion as any).creditedAt
                    ? new Date(
                        (suggestion as any).creditedAt,
                      ).toLocaleDateString()
                    : "";
                  return (
                    <Card key={idx} className="p-4 bg-card/50 border-border">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {fromName} pays {toName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {dateStr}
                          </p>
                        </div>
                        <span className="font-semibold text-success">
                          ${((suggestion as any).amount || 0).toLocaleString()}
                        </span>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
