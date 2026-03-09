import { Request, Response } from "express";
import { removeGroupMemberService } from "../../services/GroupMemberServices/removeGroupMemberService";
import redisClient from "../../../../config/redis-connection";

type GroupMemberParams = {
  groupId: string;
  userId: string;
};

export const removeGroupMemberController = async (
  req: Request<GroupMemberParams>,
  res: Response
): Promise<void> => {
  try {
    const { groupId, userId } = req.params;

    if (!groupId || !userId) {
      res.status(400).json({
        message: "Missing required parameters: groupId or userId",
      });
      return;
    }

    await removeGroupMemberService(groupId, userId);

    // delete app data cache after member removation
    await redisClient.del(`dashboard:user:${userId}`);

    res.status(200).json({
      message: "Group member removed successfully",
    });
  } catch (error: any) {
    console.error("Remove Group Member Error:", error);

    const message = error.message?.toLowerCase() || "";

    if (message.includes("not found")) {
      res.status(404).json({ message: error.message });
      return;
    }

    if (message.includes("forbidden") || message.includes("not authorized")) {
      res.status(403).json({ message: error.message });
      return;
    }

    if (message.includes("admin")) {
      res.status(409).json({ message: error.message });
      return;
    }

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
