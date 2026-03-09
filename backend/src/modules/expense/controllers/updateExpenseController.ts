import { AuthRequest } from "../../../middleware/authMiddleware";
import { Response } from "express";
import { updateExpenseService } from "../services/updateExpenseService";
import { AppError } from "../../../errors/appError";
import { GroupId } from "../../../entities/group/GroupId";
import { ExpenseId } from "../../../entities/expense/ExpenseId";
import { UserId } from "../../../entities/user/UserId";
import redisClient from "../../../config/redis-connection";

export const updateExpenseController = async (
  req: AuthRequest & { params: { groupId: GroupId; expenseId: ExpenseId } },
  res: Response,
): Promise<void> => {
  try {
    const { groupId, expenseId } = req.params;
    const userId = req.userId;
    const payload = req.body;

    if (!groupId || !expenseId || !userId) {
      res.status(400).json({
        success: false,
        message: "Missing required fields",
        code: "REQUIRED_FIELDS",
      });
      return;
    }

    const updatedExpense = await updateExpenseService(
      new GroupId(groupId.toString()),
      new UserId(userId),
      new ExpenseId(expenseId.toString()),
      payload,
    );

    // delete app data cache after expense deletion
    if (updatedExpense) await redisClient.del(`dashboard:user:${req.userId}`);

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: updatedExpense,
    });
  } catch (error: any) {
    console.error("UpdateExpenseController Error:", error);

    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        code: error.code,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
};
