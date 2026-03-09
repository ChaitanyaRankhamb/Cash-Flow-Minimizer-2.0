import { userRepository } from "../../database/mongo/user/userRepository";
import { UserId } from "../../entities/user/UserId";
import { computeDashboardStats } from "./sub-services/dashboard-calculations.service";
import { loadExpensesForGroups } from "./sub-services/expense-loader.service";
import { mapUserSplitsByExpenseId } from "./sub-services/expense-split-mapper.service";
import { loadUserGroups } from "./sub-services/group-loader.service";
import { BuildGroupsForUI } from "./sub-services/group-ui-builder.service";
import { CashFlowAppData } from "./types";

import { BuildExpenseForUI } from "../appData/sub-services/expense-ui-builder.service";
import { BuildSuggestionsForUI } from "./sub-services/suggestion-ui-builder.service";

export const appDataService = async (
  userId: UserId
): Promise<CashFlowAppData> => {

  const user = await userRepository.findUserByID(userId);

  const groups = await loadUserGroups(userId);

  const { expensesByGroups, allExpenses } =
    await loadExpensesForGroups(groups);

  const { userSplits, userSplitsByExpenseId } =
    await mapUserSplitsByExpenseId(userId);

  const dashboardStats =
    await computeDashboardStats(groups, expensesByGroups, userId);

  const groupsForUi =
    await BuildGroupsForUI(groups, expensesByGroups, userId);

  const expensesForUi =
    await BuildExpenseForUI(allExpenses, userSplitsByExpenseId);

  const suggestionsForUi =
    await BuildSuggestionsForUI(userId);

  return {
    dashboard: {
      user: {
        id: user?.id.toString() ?? "",
        username: user?.username ?? "User",
        profileImageUrl: user?.image ?? null,
        email: user?.email ?? null,
      },
      globalFinancialOverview: {
        totalGroupsJoined: groups.length,
        totalExpensesRecorded: allExpenses.length,
        totalPendingSettlements: dashboardStats.totalPendingSettlements,
        totalSettledTransactions: dashboardStats.totalSettledTransactions,
      },
      debtStatus: {
        totalActiveDebtAmount: dashboardStats.totalActiveDebtAmount,
        totalActiveGroups: dashboardStats.totalActiveGroups,
        youOwe: dashboardStats.youOwe,
        youAreOwed: dashboardStats.youAreOwed,
        balancedGroups: dashboardStats.balancedGroups,
        netPosition: dashboardStats.netPosition,
      },
      optimizationStats: {
        totalNaiveTransactions: dashboardStats.totalNaiveTransactions,
        totalOptimizedTransactions: dashboardStats.totalOptimizedTransactions,
        transactionsSaved: Number(dashboardStats.transactionSaved.toFixed(2)),
      },
    },

   groups: {
      header: {
        totalGroupsJoined: groups.length,
        youOwe: dashboardStats.youOwe,
        youAreOwed: dashboardStats.youAreOwed,
      },
      groups: groupsForUi,
    },

    expenses: {
      header: {
        totalExpenses: allExpenses.length,
        totalYouPaid: allExpenses
          .filter((e) => e.paidBy.toString() === userId.toString())
          .reduce((sum, e) => sum + e.totalAmount, 0),
        totalYouOwe: userSplits
          .filter((s) => !s.isSettled)
          .reduce((sum, s) => sum + s.amount, 0),
      },
      expenses: expensesForUi,
    },

    suggestions: {
      summary: {
        totalYouOwe: dashboardStats.youOwe,
        totalYouAreOwed: dashboardStats.youAreOwed,
        netPosition: dashboardStats.netPosition,
      },
      pending: suggestionsForUi.suggestionsPendingForUi,
      history: suggestionsForUi.suggestionHistoryForUi,
    },
  };
};
