import { expenseRepository } from "../../../database/mongo/expense/expenseRepository";
import { expenseSplitRepository } from "../../../database/mongo/expense/expenseSplitRepository";
import { groupRepository } from "../../../database/mongo/group/groupRepository";
import { userRepository } from "../../../database/mongo/user/userRepository";
import { Expense } from "../../../entities/expense/Expense";
import { ExpenseId } from "../../../entities/expense/ExpenseId";
import { UpdateExpenseData } from "../../../entities/expense/ExpenseRepository";
import { CreateExpenseSplitData } from "../../../entities/expense/ExpenseSplitRepository";
import { GroupId } from "../../../entities/group/GroupId";
import { UserId } from "../../../entities/user/UserId";
import { AppError } from "../../../errors/appError";

const round2 = (n: number): number => Math.round(n * 100) / 100;

export const updateExpenseService = async (
  groupId: GroupId,
  requesterId: UserId,
  expenseId: ExpenseId,
  payload: UpdateExpenseData,
): Promise<Expense> => {
  try {

    console.log("payload", payload);
    
    // user validation
    const user = await userRepository.findUserByID(requesterId);
    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    // paid by validation (if being updated)
    if (payload.paidBy) {
      const paidByUser = await userRepository.findUserByID(payload.paidBy);
      if (!paidByUser) {
        throw new AppError("Paid by user not found", 404, "USER_NOT_FOUND");
      }
    }

    // group validation
    const group = await groupRepository.findGroupById(groupId);
    if (!group) {
      throw new AppError("Group not found", 404, "GROUP_NOT_FOUND");
    }

    // expense validation
    const expense = await expenseRepository.getExpenseById(expenseId);
    if (!expense) {
      throw new AppError("Expense not found", 404, "EXPENSE_NOT_FOUND");
    }

    // expense updater must be expense creator
    if (expense.createdBy.toString() !== requesterId.toString()) {
      throw new AppError(
        "Only the expense creator can update the expense",
        403,
        "FORBIDDEN",
      );
    }

    // if totalAmount is being updated, it must be positive
    if (typeof payload.totalAmount !== "number" || payload.totalAmount <= 0) {
      throw new AppError(
        "Total amount must be positive",
        400,
        "VALIDATION_ERROR",
      );
    }

    // if splits are being updated, there must be at least one participant
    if (!payload.splits || payload.splits.length === 0) {
      throw new AppError(
        "At least one participant is required",
        400,
        "VALIDATION_ERROR",
      );
    }

    const groupMembers = await groupRepository.findAllGroupMembers(groupId);

    // all split members must be part of the group
    if (groupMembers) {
      payload.splits.forEach((s) => {
        let isMember = false;

        for (const member of groupMembers) {
          if (member._userId.toString() === s.userId.toString()) {
            isMember = true;
          }
        }

        if (!isMember) {
          throw new AppError(
            "One of the split member is not the member of group",
            400,
            "VALIDATION_ERROR",
          );
        }
      });
    }

    // split type validation
    const splitType = String(payload.splitType);
    if (!["equal", "percentage", "exact"].includes(splitType)) {
      throw new AppError(
        "Invalid split type", 
        400, 
        "VALIDATION_ERROR"
      );
    }

    // update the expense
    const updated = await expenseRepository.updateExpense({
      ...payload,
      expenseId,
      groupId,
    });

    if (!updated) {
      throw new AppError(
        "Expense update failed", 
        500, 
        "INTERNAL_ERROR"
      );
    }

    // recreate new expense splits
    if (payload.splits) {
      await recreateSplits(
        expenseId,
        payload.splits,
        payload.totalAmount,
        splitType,
      );
    }

    return updated;
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error; // controller will handle it
    }
    throw new AppError(
      "Internal Server Error", 
      500, 
      "INTERNAL_ERROR"
    );
  }
};

/* ========================================================= */
/* ================= SPLIT RECREATION ====================== */
/* ========================================================= */
const recreateSplits = async (
  expenseId: ExpenseId,
  splits: any[],
  totalAmount: number,
  splitType: string,
) => {
  // delete existing splits
  await expenseSplitRepository.deleteExpenseSplits(expenseId);

  const toCreate: CreateExpenseSplitData[] = [];

  // for equal splits
  if (splitType === "equal" || splitType === "percentage") {
    const base = round2(totalAmount / splits.length);
    let remainder = round2(totalAmount);

    splits.forEach((s,i) => {
      const amount = (i === splits.length - 1) ? remainder : base;
      remainder = round2(remainder - base);
      toCreate.push({ expenseId, userId: s.userId, amount });
    });
  }

  // if (splitType === "percentage") {
  //   const sum = splits.reduce((t, s) => t + (s.value ?? 0), 0);
  //   if (sum !== 100)
  //     throw new AppError(
  //       "Total percentage must equal 100",
  //       400,
  //       "VALIDATION_ERROR",
  //     );

  //   let remainder = round2(totalAmount);
  //   splits.forEach((s, i) => {
  //     const amount =
  //       i === splits.length - 1
  //         ? remainder
  //         : round2((totalAmount * s.value) / 100);
  //     remainder = round2(remainder - amount);
  //     toCreate.push({
  //       expenseId,
  //       userId: s.userId,
  //       amount,
  //       percentage: s.value,
  //     });
  //   });
  // }

  if (splitType === "exact") {
    const sum = round2(splits.reduce((t, s) => t + s.value, 0));
    if (sum !== round2(totalAmount))
      throw new AppError(
    "Exact split total mismatch", 
    400, 
    "VALIDATION_ERROR"
  );

    splits.forEach((s) =>
      toCreate.push({ expenseId, userId: s.userId, amount: round2(s.value) }),
    );
  }

  for (const s of toCreate) {
    await expenseSplitRepository.createExpenseSplit(s);
  }
};
