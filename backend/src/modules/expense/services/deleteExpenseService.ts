import { expenseRepository } from "../../../database/mongo/expense/expenseRepository";
import { expenseSplitRepository } from "../../../database/mongo/expense/expenseSplitRepository";
import { groupRepository } from "../../../database/mongo/group/groupRepository";
import { userRepository } from "../../../database/mongo/user/userRepository";

import { ExpenseId } from "../../../entities/expense/ExpenseId";
import { GroupId } from "../../../entities/group/GroupId";
import { UserId } from "../../../entities/user/UserId";

import { AppError } from "../../../errors/appError";

export const deleteExpenseService = async (
  groupId: GroupId,
  userId: UserId,
  expenseId: ExpenseId
): Promise<void> => {


  const user = await userRepository.findUserByID(userId);
  if (!user) {
    throw new AppError(
      "User not found",
      404,
      "USER_NOT_FOUND"
    );
  }


  const group = await groupRepository.findGroupById(groupId);
  if (!group) {
    throw new AppError(
      "Group not found",
      404,
      "GROUP_NOT_FOUND"
    );
  }


  const expense = await expenseRepository.getExpenseByIdAndGroup(
    groupId,
    expenseId
  );

  if (!expense) {
    throw new AppError(
      "Expense not found",
      404,
      "EXPENSE_NOT_FOUND"
    );
  }

  console.log("Deleting expense with ID:", expense.paidBy.toString());
  console.log("User ID:", userId.toString());

  if (expense.paidBy.toString() !== userId.toString()) {
    throw new AppError(
      "You are not authorized to delete this expense",
      403,
      "FORBIDDEN"
    );
  }


  await expenseSplitRepository.deleteExpenseSplits(expenseId);

  await expenseRepository.deleteExpense(groupId, expenseId);
};