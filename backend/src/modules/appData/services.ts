import { Response } from "express";
import { CashFlowAppData } from "./types";
import { userRepository } from "../../database/mongo/user/userRepository";
import { groupRepository } from "../../database/mongo/group/groupRepository";
import { expenseRepository } from "../../database/mongo/expense/expenseRepository";
import { expenseSplitRepository } from "../../database/mongo/expense/expenseSplitRepository";
import { suggestionRepository } from "../../database/mongo/settled/suggestionRepository";
import { settlementRepository } from "../../database/mongo/settlement/settlementRepository";
import { UserId } from "../../entities/user/UserId";
import { Group } from "../../entities/group/Group";
import { GroupMember } from "../../entities/group/GroupMember";
import { Expense } from "../../entities/expense/Expense";
import { ExpenseSplit } from "../../entities/expense/ExpenseSplit";
import { computeNetBalances } from "../balance/balance.service";

export const appDataService = async (
  userId: UserId,
  _res: Response, // kept for compatibility, currently unused
): Promise<CashFlowAppData> => {
  // Helper: cache usernames by userId string
  const usernameCache = new Map<string, string>();

  const getUsername = async (idStr: string): Promise<string> => {
    if (usernameCache.has(idStr)) return usernameCache.get(idStr)!;

    const user = await userRepository.findUserByID(new UserId(idStr));
    const username = user?.username ?? "";
    usernameCache.set(idStr, username);
    return username;
  };

  // 1. Basic user and groups
  const user = await userRepository.findUserByID(userId);
  const groups: Group[] = await groupRepository.findGroupsByUser(userId);

  // 2. Load expenses for all groups owned by the user
  const expensesByGroup: Expense[][] = await Promise.all(
    groups.map((g) => expenseRepository.getExpensesByGroup(g.id)),
  );
  const allExpenses: Expense[] = expensesByGroup.flat();

  // 3. Splits for this user (across all expenses)
  const userSplits: ExpenseSplit[] =
    await expenseSplitRepository.getExpenseSplitsByUserId(userId);

  const userSplitsByExpenseId = new Map<string, ExpenseSplit[]>();
  for (const split of userSplits) {
    const key = split.expenseId.toString();
    const arr = userSplitsByExpenseId.get(key) ?? [];
    arr.push(split);
    userSplitsByExpenseId.set(key, arr);
  }

  // 4. Suggestions (pending settlements) and settled transactions
  const pendingSuggestions = await suggestionRepository.getPendingSuggestionsByUser(
    userId,
  );
  const userSettlements =
    await settlementRepository.findSettlementsByUser(userId);

  // 5. Global financial overview
  const totalGroupsJoined = groups.length;
  const totalExpensesRecorded = allExpenses.length;
  const totalPendingSettlements = pendingSuggestions.length;
  const totalSettledTransactions = userSettlements.length;

  // 6. Debt / credit status for the user across all groups
  let totalActiveDebtAmount = 0;
  let totalActiveGroups = 0;
  let youOwe = 0;
  let youAreOwed = 0;
  let balancedGroups = 0;

  for (let i = 0; i < groups.length; i++) {
    const groupExpenses = expensesByGroup[i] ?? [];
    if (groupExpenses.length === 0) continue;

    const expenseIds = groupExpenses.map((e) => e._id);
    const groupSplits =
      await expenseSplitRepository.getExpenseSplitsByExpenseIds(expenseIds);

    const balanceMap = computeNetBalances(groupExpenses, groupSplits);
    const userNet = balanceMap.get(userId.toString()) ?? 0;

    if (userNet === 0) {
      balancedGroups += 1;
      continue;
    }

    totalActiveGroups += 1;
    totalActiveDebtAmount += Math.abs(userNet);

    if (userNet > 0) {
      youAreOwed += userNet;
    } else {
      youOwe += Math.abs(userNet);
    }
  }

  const netPosition = youAreOwed - youOwe;

  // 7. Expense summaries for the user (for header + global expenses section)
  const totalExpenses = allExpenses.length;
  const totalYouPaid = allExpenses
    .filter((e) => e.paidBy.toString() === userId.toString())
    .reduce((sum, e) => sum + e.totalAmount, 0);

  const totalYouOwe = userSplits
    .filter((s) => !s.isSettled)
    .reduce((sum, s) => sum + s.amount, 0);

  // Map of groupId -> groupName for quick lookups
  const groupNameById = new Map<string, string>();
  for (const g of groups) {
    groupNameById.set(g.id.toString(), g.name);
  }

  // 8. Per‑group detailed data (groups section)
  const groupsForUi = await Promise.all(
    groups.map(async (g, index) => {
      const groupExpenses = expensesByGroup[index] ?? [];

      // Members
      const members: GroupMember[] | null =
        await groupRepository.findAllGroupMembers(g.id);
      const memberList = members
        ? await Promise.all(
            members.map((m) => getUsername(m._userId.toString())),
          )
        : [];

      // Group balances and overview
      let totalExpensesAmount = 0;
      let yourNetBalance = 0;
      let groupStatus: "active" | "balanced" = "balanced";
      let recentTransctionList:
        | {
            timeOfpaid: Date;
            transactionName: string;
            amount: number;
          }[] = [];

      if (groupExpenses.length > 0) {
        totalExpensesAmount = groupExpenses.reduce(
          (sum, e) => sum + e.totalAmount,
          0,
        );

        const expenseIds = groupExpenses.map((e) => e._id);
        const groupSplits =
          await expenseSplitRepository.getExpenseSplitsByExpenseIds(
            expenseIds,
          );
        const balanceMap = computeNetBalances(groupExpenses, groupSplits);
        yourNetBalance = balanceMap.get(userId.toString()) ?? 0;

        groupStatus = yourNetBalance === 0 ? "balanced" : "active";

        recentTransctionList = [...groupExpenses]
          .sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
          )
          .slice(0, 5)
          .map((exp) => ({
            timeOfpaid: exp.createdAt,
            transactionName: exp.title,
            amount: exp.totalAmount,
          }));
      }

      // Group expenses list for this group
      const expensesList = await Promise.all(
        groupExpenses.map(async (exp) => ({
          nameOfExpense: exp.title,
          paidBy: await getUsername(exp.paidBy.toString()),
          amount: exp.totalAmount,
        })),
      );

      // User‑related settlements for this group
      const groupSettlements =
        await settlementRepository.findSettlementsByUser(userId, g.id);
      const listOfSettelments = await Promise.all(
        groupSettlements.map(async (s) => ({
          who: await getUsername(s.who),
          whom: await getUsername(s.whom),
          amount: s.amount,
        })),
      );

      return {
        groupName: g.name,
        groupStatus,
        membersCount: memberList.length,
        memberList,
        overview: {
          totalExpensesAmount,
          yourNetBalance,
          recentTransctionList,
        },
        expenses: {
          expensesList,
        },
        settlements: {
          listOfSettelments,
        },
      };
    }),
  );

  // 9. Global expenses list across all groups
  const expensesForUi = await Promise.all(
    allExpenses.map(async (exp) => {
      const splitsForThisExpense =
        userSplitsByExpenseId.get(exp._id.toString()) ?? [];

      const userShare = splitsForThisExpense.reduce(
        (sum, s) => sum + s.amount,
        0,
      );
      const hasUnsettled = splitsForThisExpense.some((s) => !s.isSettled);

      return {
        expenseName: exp.title,
        groupName: groupNameById.get(exp.groupId.toString()) ?? "",
        paidBY: await getUsername(exp.paidBy.toString()),
        totalAmount: exp.totalAmount,
        userShare,
        status: hasUnsettled ? ("pending" as const) : ("settled" as const),
        createdAt: exp.createdAt.toISOString(),
      };
    }),
  );

  // 10. Settlements section
  const settlementSuggestionsForUi = await Promise.all(
    pendingSuggestions.map(async (s) => ({
      amount: s.amount,
      status: "pending" as const,
      from: await getUsername(s.who.toString()),
      to: await getUsername(s.whom.toString()),
      groupName: groupNameById.get(s.groupId.toString()) ?? "",
      creditedAt: s.creditedAt,
    })),
  );

  const settlementHistoryForUi = await Promise.all(
    userSettlements.map(async (s) => ({
      who: await getUsername(s.who),
      whom: await getUsername(s.whom),
      amount: s.amount,
      // We don't have createdAt on the entity, so use a placeholder
      settledAt: new Date(0),
    })),
  );

  // 11. Build final app data object matching CashFlowAppData exactly
  const appData: CashFlowAppData = {
    dashboard: {
      user: {
        id: user?.id ?? null,
        username: user?.username ?? "User",
        profileImageUrl: user?.image ?? null,
        email: user?.email ?? null,
      },
      globalFinancialOverview: {
        totalGroupsJoined,
        totalExpensesRecorded,
        totalPendingSettlements,
        totalSettledTransactions,
      },
      debtStatus: {
        totalActiveDebtAmount,
        totalActiveGroups,
        youOwe,
        youAreOwed,
        balancedGroups,
        netPosition,
      },
      optimizationStats: {
        totalNaiveTransactions: 0,
        totalOptimizedTransactions: 0,
        transactionsSaved: 0,
      },
    },
    groups: {
      header: {
        totalGroupsJoined,
        youOwe,
        youAreOwed,
      },
      groups: groupsForUi,
    },
    expenses: {
      header: {
        totalExpenses,
        totalYouPaid,
        totalYouOwe,
      },
      expenses: expensesForUi,
    },
    settlements: {
      summary: {
        totalYouOwe,
        totalYouAreOwed: youAreOwed,
        netPosition,
      },
      settlementSuggestions: settlementSuggestionsForUi,
      settlementHistory: settlementHistoryForUi,
    },
  };

  return appData;
};