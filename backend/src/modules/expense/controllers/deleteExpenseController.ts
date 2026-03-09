import { AuthRequest } from "../../../middleware/authMiddleware";
import { Response } from "express";
import { deleteExpenseService } from "../services/deleteExpenseService";
import { AppError } from "../../../errors/appError";
import { GroupId } from "../../../entities/group/GroupId";
import { ExpenseId } from "../../../entities/expense/ExpenseId";
import { UserId } from "../../../entities/user/UserId";
import redisClient from "../../../config/redis-connection";

export const deleteExpenseController = async (
  req: AuthRequest & { params: { groupId: GroupId; expenseId: ExpenseId } },
  res: Response,
): Promise<void> => {
  try {
    const { groupId, expenseId } = req.params;
    const userId = req.userId;
    console.log("groupId", groupId);
    console.log("expenseId", expenseId);

    if (!groupId || !expenseId || !userId) {
      res.status(400).json({
        success: false,
        message: "Missing required fields",
        code: "REQUIRED_FIELDS",
      });
      return;
    }

    await deleteExpenseService(
      new GroupId(groupId.toString()),
      new UserId(userId),
      new ExpenseId(expenseId.toString()),
    );

    // delete app data cache after expense deletion
    await redisClient.del(`dashboard:user:${req.userId}`);

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error: any) {
    console.error("DeleteExpenseController Error:", error);

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
