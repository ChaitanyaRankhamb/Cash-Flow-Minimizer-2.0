import { mapUserSplitsByExpenseId } from './expense-split-mapper.service';
import { Expense } from "../../../entities/expense/Expense";
import { CashFlowAppData } from "../types";
import { ExpenseSplit } from '../../../entities/expense/ExpenseSplit';

 
 export const BuildExpenseForUI = async(
  allExpenses: Expense[],
  userSplitsByExpenseId: Map<string, ExpenseSplit[]>,
 ) => {
 const expensesForUi: CashFlowAppData["expenses"]["expenses"] =
    allExpenses.map((exp) => {
      const splitsForThisExpense =
        userSplitsByExpenseId.get(exp._id.toString()) ?? [];

      const userShare = splitsForThisExpense.reduce(
        (sum, s) => sum + s.amount,
        0,
      );

      const hasUnsettled = splitsForThisExpense.some((s) => !s.isSettled);

      return {
        expenseId: exp._id.toString(),
        groupId: exp.groupId.toString(),
        expenseName: exp.title,
        paidByUserId: exp.paidBy.toString(),
        totalAmount: exp.totalAmount,
        userShare,
        status: hasUnsettled ? ("pending" as const) : ("settled" as const),
        createdAt: exp.createdAt.toISOString(),
      };
    });

  return expensesForUi;
  }