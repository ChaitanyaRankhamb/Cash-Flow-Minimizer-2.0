import { Response } from "express";
import { AuthRequest } from "../../../../middleware/authMiddleware";
import { AppError } from "../../../../errors/appError";
import { GroupId } from "../../../../entities/group/GroupId";
import { deleteGroupService } from "../../services/GroupServices/deleteGroupService";
import { UserId } from "../../../../entities/user/UserId";

export const deleteGroupController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { groupId } = req.params;
    const userId = req.userId;

    /* -------------------- Validation -------------------- */
    if (!groupId || !userId) {
      res.status(400).json({
        success: false,
        message: "Missing required fields",
        code: "REQUIRED_FIELDS",
      });
      return;
    }

    await deleteGroupService(new GroupId(groupId.toString()), new UserId(userId));

    res.status(200).json({
      success: true,
      message: "Group deleted successfully",
    });
  } catch (error: any) {
    console.error("DeleteGroupController Error:", error);

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