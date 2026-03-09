import { expenseSplitRepository } from "../../../database/mongo/expense/expenseSplitRepository";
import { UserId } from "../../../entities/user/UserId";


export const mapUserSplitsByExpenseId = async (userId: UserId) => {
  const userSplits = await expenseSplitRepository.getExpenseSplitsByUserId(userId);

  const map = new Map<string, typeof userSplits>();

  for (const split of userSplits) {
    const key = split.expenseId.toString();
    const arr = map.get(key) ?? [];
    arr.push(split);
    map.set(key, arr);
  }

  return {
    userSplits,
    userSplitsByExpenseId: map
  }
}