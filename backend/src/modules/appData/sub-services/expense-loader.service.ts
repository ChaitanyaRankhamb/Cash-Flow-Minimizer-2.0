import { expenseRepository } from "../../../database/mongo/expense/expenseRepository";
import { Expense } from "../../../entities/expense/Expense";
import { Group } from "../../../entities/group/Group";


export const loadExpensesForGroups = async (groups: Group[]) => {
  const expensesByGroups = await Promise.all(
    groups.map((g) => {
      return expenseRepository.getExpensesByGroup(g.id);
    })
  )

  return {
    expensesByGroups,
    allExpenses: expensesByGroups.flat()
  }
}