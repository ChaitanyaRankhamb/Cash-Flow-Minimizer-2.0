"use client";

import { useAppDataStore } from "@/store/useAppDataStore";
import { GroupCard } from "./group-card";

/* =========================
   Types From Store
========================= */

export interface StoreGroup {
  id: string;
  groupName: string;
  // track possible values coming from backend; UI treats "balanced" same as settled
  groupStatus: "active" | "balanced" | "settled" | "archived";
  members: {
    userId: string;
    username: string;
    profileImageUrl?: string | null;
  }[];
  overview: {
    totalExpensesAmount: number;
    yourNetBalance: number;
    recentTransctionList: {
      timeOfpaid: string; // ISO string
      transactionName: string;
      amount: number;
    }[];
  };
  expenses: {
    expensesList: {
      id: string;
      nameOfExpense: string;
      paidByUserId: string;
      totalAmount: number;
      createdAt: string;
      splits: {
        userId: string;
        share: number;
      }[];
    }[];
  };
  suggestions: {
    listOfSuggestions: {
      id: string;
      fromUserId: string;
      toUserId: string;
      amount: number;
      creditedAt: string; // ISO string
      status: "pending" | "settled";
    }[];
  };
}

/* =========================
   Component
========================= */

export function GroupsGrid() {
  const appData = useAppDataStore((s) => s.appData);
  const loading = useAppDataStore((s) => s.loading);
  const error = useAppDataStore((s) => s.error);

  // convert raw appData pods into our simplified StoreGroup shape
  const groupData: StoreGroup[] =
    appData?.groups?.groups.map((g) => ({
      id: g.id,
      groupName: g.groupName,
      groupStatus: g.groupStatus as StoreGroup["groupStatus"],
      members: g.members,
      overview: g.overview,
      expenses: g.expenses,
      suggestions: g.suggestions ?? { listOfSuggestions: [] },
    })) || [];

  /* ========= Loading ========= */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        Loading groups...
      </div>
    );
  }

  /* ========= Error ========= */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-red-500 font-medium">Failed to load groups</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please try again later.
        </p>
      </div>
    );
  }

  /* ========= Empty ========= */
  if (!groupData.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium text-foreground">No Groups Found</p>
        <p className="text-sm text-muted-foreground mt-2">
          Create a group to start tracking expenses.
        </p>
      </div>
    );
  }

  /* ========= Transform Store Data → GroupCardProps ========= */

  const transformedGroups = groupData.map((group) => {
    const recentList = group.overview.recentTransctionList;

    return {
      name: group.groupName,
      status: group.groupStatus,
      totalExpenses: group.overview.totalExpensesAmount,
      yourBalance: group.overview.yourNetBalance,
      lastActivity:
        recentList && recentList.length > 0
          ? `Updated ${new Date(recentList[0].timeOfpaid).toLocaleDateString()}`
          : "No recent activity",
      members: group.members.map((member) => ({
        name: member.username,
        avatar: member.profileImageUrl || "",
        initials: member.username
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase(),
      })),
      groupData: group,
    };
  });

  /* ========= Success ========= */

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {transformedGroups.map((group) => (
        <GroupCard key={group.name} {...group} />
      ))}
    </div>
  );
}
