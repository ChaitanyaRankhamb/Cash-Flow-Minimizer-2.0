import { expenseSplitRepository } from "../../../database/mongo/expense/expenseSplitRepository";
import { suggestionRepository } from "../../../database/mongo/settled/suggestionRepository";
import { settlementRepository } from "../../../database/mongo/settlement/settlementRepository";
import { Expense } from "../../../entities/expense/Expense";
import { Group } from "../../../entities/group/Group";
import { UserId } from "../../../entities/user/UserId";
import { computeNetBalances } from "../../balance/balance.service";
import { groupMinimizationService } from "../../minimization/minimization.service";

export const computeDashboardStats = async (
  groups: Group[],
  expensesByGroups: Expense[][],
  userId: UserId,
) => {
  let totalActiveDebtAmount = 0;
  let totalActiveGroups = 0;
  let youOwe = 0;
  let youAreOwed = 0;
  let balancedGroups = 0;
  let totalNaiveTransactions = 0;
  let totalOptimizedTransactions = 0;

  const pendingSuggestions =
    await suggestionRepository.getPendingSuggestionsByUser(userId);

  const userSettlements =
    await settlementRepository.findSettlementsByUser(userId);

  const totalPendingSettlements = pendingSuggestions.length;
  const totalSettledTransactions = userSettlements.length;

  for (let i = 0; i < groups.length; i++) {
    const groupExpenses = expensesByGroups[i] ?? [];
    if (groupExpenses.length === 0) continue;

    const expenseIds = groupExpenses.map((e) => e._id);
    const splits =
      await expenseSplitRepository.getExpenseSplitsByExpenseIds(expenseIds);

    const balanceMap = computeNetBalances(groupExpenses, splits);
    const userNet = balanceMap.get(userId.toString()) ?? 0;

    totalNaiveTransactions += splits.length;

    const optimizedSuggestions = await groupMinimizationService(
      groups[i]!.id,
      userId,
    );
    totalOptimizedTransactions += optimizedSuggestions.length;

    if (userNet === 0) {
      balancedGroups++;
      continue;
    }

    totalActiveGroups++;
    totalActiveDebtAmount += Math.abs(userNet);

    if (userNet > 0) youAreOwed += userNet;
    else youOwe += Math.abs(userNet);
  }

  const netPosition = youAreOwed - youOwe;

  const transactionSaved =
    totalNaiveTransactions === 0
      ? 0
      : ((totalNaiveTransactions - totalOptimizedTransactions) /
          totalNaiveTransactions) *
        100;

  return {
    totalActiveDebtAmount,
    totalActiveGroups,
    youOwe,
    youAreOwed,
    balancedGroups,
    totalNaiveTransactions,
    totalOptimizedTransactions,
    transactionSaved,
    netPosition,
    totalPendingSettlements,
    totalSettledTransactions
  };
};
