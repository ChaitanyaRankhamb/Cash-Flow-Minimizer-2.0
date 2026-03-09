import { Request, Response } from "express";
import { updateGroupMemberRoleService } from "../../services/GroupMemberServices/updateGroupMemberRoleService";
import redisClient from "../../../../config/redis-connection";

type GroupMemberParams = {
  groupId: string;
  userId: string;
};

interface UpdateGroupMemberRoleBody {
  role: string;
}

export const updateGroupMemberRoleController = async (
  req: Request<GroupMemberParams, {}, UpdateGroupMemberRoleBody>,
  res: Response,
): Promise<void> => {
  try {
    const { groupId, userId } = req.params;
    const { role } = req.body;

    if (!groupId || !userId || !role) {
      res.status(400).json({
        message: "Missing required fields: groupId, userId, role",
      });
      return;
    }

    const updatedMember = await updateGroupMemberRoleService(
      groupId,
      userId,
      role,
    );

    // delete app data cache after member removation
    if (updatedMember) await redisClient.del(`dashboard:user:${userId}`);

    res.status(200).json({
      message: "Group member role updated successfully",
      member: updatedMember,
    });
  } catch (error: any) {
    console.error("Update Group Member Role Error:", error);

    const message = error.message?.toLowerCase() || "";

    if (message.includes("not found")) {
      res.status(404).json({ message: error.message });
      return;
    }

    if (message.includes("forbidden") || message.includes("not authorized")) {
      res.status(403).json({ message: error.message });
      return;
    }

    if (message.includes("already")) {
      res.status(409).json({ message: error.message });
      return;
    }

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
