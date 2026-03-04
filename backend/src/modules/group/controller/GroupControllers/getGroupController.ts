import { Response } from "express";
import { UserId } from "../../../../entities/user/UserId";
import { GroupId } from "../../../../entities/group/GroupId";
import { AuthRequest } from "../../../../middleware/authMiddleware";
import { getGroupService } from "../../services/GroupServices/getGroupService";

interface GetGroupQuery {
  groupId?: string;
  name?: string;
}

export const getGroupController = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { groupId, name } = req.query as unknown as GetGroupQuery;
    const userId = req.userId;

    const groupIdObj = groupId ? new GroupId(groupId) : undefined;
    const userIdObj = userId ? new UserId(userId) : undefined;

    const groups = await getGroupService(groupIdObj?.toString(), name, userIdObj?.toString());

    if (!groups || (Array.isArray(groups) && groups.length === 0)) {
      res.status(200).json({
        success: true,
        message: "No groups found",
        data: [],
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Group(s) fetched successfully",
      data: Array.isArray(groups) ? groups : [groups],
    });
  } catch (error: any) {
    console.error("Get Group Error:", error);

    const message = error.message?.toLowerCase() || "";

    if (message.includes("not found")) {
      res.status(404).json({ success: false, message: error.message });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
