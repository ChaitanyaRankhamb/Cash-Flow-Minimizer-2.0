import { expenseSplitRepository } from './../../../database/mongo/expense/expenseSplitRepository';
import { Group } from "../../../entities/group/Group";
import { Expense } from '../../../entities/expense/Expense';
import { groupRepository } from '../../../database/mongo/group/groupRepository';
import { getUserInfo } from './get-user-info.service';
import { Suggestion } from '../../../entities/settled/Suggestion';
import { computeNetBalances } from '../../balance/balance.service';
import { groupMinimizationService } from '../../minimization/minimization.service';
import { UserId } from '../../../entities/user/UserId';
import { userRepository } from '../../../database/mongo/user/userRepository';


export const BuildGroupsForUI = async(
  groups: Group[],
  expensesByGroups: Expense[][],
  userId: UserId,
) => {
  const groupsForUi = await Promise.all(
    groups.map(async (g, index) => {
      const groupExpenses = expensesByGroups[index] ?? [];

      const members = await groupRepository.findAllGroupMembers(g.id);

      const formattedMembers = await Promise.all(
        (members ?? []).map(async (m) => {
          const idStr = m._userId.toString();
          const userInfo = await getUserInfo(idStr);

          return {
            userId: idStr,
            username: userInfo.username || "Unknown",
            profileImageUrl: userInfo.image,
          };
        }),
      );

      let totalExpensesAmount = 0;
      let yourNetBalance = 0;
      let groupStatus: "active" | "balanced" = "balanced";
      let suggestions: Suggestion[] = [];

      if (groupExpenses.length > 0) {
        totalExpensesAmount = groupExpenses.reduce(
          (sum, e) => sum + e.totalAmount,
          0,
        );

        const expenseIds = groupExpenses.map((e) => e._id);
        const splits =
          await expenseSplitRepository.getExpenseSplitsByExpenseIds(expenseIds);

        const balanceMap = computeNetBalances(groupExpenses, splits);
        yourNetBalance = balanceMap.get(userId.toString()) ?? 0;
        groupStatus = yourNetBalance === 0 ? "balanced" : "active";

        suggestions = await groupMinimizationService(g.id, userId);
      }

      return {
        id: g.id.toString(),
        groupName: g.name,
        description: g.description ?? "",
        groupStatus,
        createdAt: g.createdAt,

        members: formattedMembers,

        overview: {
          totalExpensesAmount,
          yourNetBalance,
          recentTransctionList: groupExpenses
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, 5)
            .map((e) => ({
              timeOfpaid: e.createdAt.toISOString(),
              transactionName: e.title,
              amount: e.totalAmount,
            })),
        },

        expenses: {
          expensesList: await Promise.all(
            groupExpenses.map(async (exp) => {
              const splits =
                await expenseSplitRepository.getExpenseSplitsByExpenseIds([
                  exp._id,
                ]);

              return {
                id: exp._id.toString(),
                nameOfExpense: exp.title,
                paidByUserId: exp.paidBy.toString(),
                totalAmount: exp.totalAmount,
                createdAt: exp.createdAt.toISOString(),
                splits: splits.map((s) => ({
                  userId: s.userId.toString(),
                  share: s.amount,
                })),
              };
            }),
          ),
        },

        suggestions: {
          listOfSuggestions: await Promise.all(
            suggestions.map(async (s) => {
              const whoUser = await userRepository.findUserByID(s.who);
              const whomUser = await userRepository.findUserByID(s.whom);

              return {
                id: s._id?.toString ? s._id.toString() : String(s._id),
                fromUserId: whoUser?.username ?? "",
                toUserId: whomUser?.username ?? "",
                amount: s.amount,
                creditedAt: s.creditedAt.toISOString(),
                status: s.isSettled
                  ? ("settled" as const)
                  : ("pending" as const),
              };
            }),
          ),
        },
      };
    }),
  );

  return groupsForUi;
}