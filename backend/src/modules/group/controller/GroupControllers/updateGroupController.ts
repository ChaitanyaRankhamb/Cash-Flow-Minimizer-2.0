import { AuthRequest } from './../../../../middleware/authMiddleware';
import { Response, Request } from "express";
import { AppError } from "../../../../errors/appError";
import { GroupId } from "../../../../entities/group/GroupId";
import { updateGroupService } from "../../services/GroupServices/updateGroupService";
import { UserId } from '../../../../entities/user/UserId';

interface UpdateGroupBody {
  name?: string;
  description?: string;
}

export const updateGroupController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { groupId } = req.params ?? {};
    const { name, description } = req.body ?? {};
    const userId = req.userId;

    if (!groupId || !userId) {
      res.status(400).json({
        success: false,
        message: "Missing required fields",
        code: "REQUIRED_FIELDS",
      });
      return;
    }

    if (!name && !description) {
      res.status(400).json({
        success: false,
        message: "Nothing to update. Provide name or description",
        code: "NOTHING_TO_UPDATE",
      });
      return;
    }

    const payload: UpdateGroupBody = {};
    if (name !== undefined) payload.name = name;
    if (description !== undefined) payload.description = description;

    const updatedGroup = await updateGroupService(
      new UserId(userId),
      new GroupId(groupId.toString()),
      payload,
    );

    res.status(200).json({
      success: true,
      message: "Group updated successfully",
      data: updatedGroup,
    });

  } catch (error: any) {
    console.error("UpdateGroupController Error:", error);

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