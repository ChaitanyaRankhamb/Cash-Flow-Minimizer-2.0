import { AuthRequest } from "../../../middleware/authMiddleware";
import { Response } from "express";
import { getExpensesByGroupService } from "../services/getExpensesByGroupService";

export const getExpensesByGroupController = async (
  req: AuthRequest & { params: { groupId: string } },
  res: Response,
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const expenses = await getExpensesByGroupService({
      groupId: req.params.groupId,
      requesterId: req.userId,
    });

    const result = expenses.map((e) => ({
      id: e._id.toString(),
      groupId: e.groupId.toString(),
      title: e.title,
      amount: e.totalAmount,
      paidBy: e.paidBy.toString(),
      createdBy: e.createdBy.toString(),
      notes: e.notes ?? "",
      expenseDate: e.expenseDate,
    }));

    res.status(200).json({
      success: true,
      message: "Expenses retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Get Expenses Error:", error);

    switch (error.name) {
      case "GroupNotFoundError":
        res.status(404).json({ success: false, message: error.message });
        break;

      case "ForbiddenError":
        res.status(403).json({ success: false, message: error.message });
        break;

      default:
        res.status(500).json({
          success: false,
          message: "Internal Server Error",
        });
    }
  }
};
