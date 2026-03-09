import { Response } from "express";
import { AuthRequest } from "../../../../middleware/authMiddleware";
import { AppError } from "../../../../errors/appError";
import { createGroupService } from "../../services/GroupServices/createGroupService";
import redisClient from "../../../../config/redis-connection";

interface CreateGroupBody {
  name: string;
  description?: string;
}

export const createGroupController = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { name, description } = req.body ?? {};
    const userId = req.userId;

    if (!name || !userId) {
      res.status(400).json({
        success: false,
        message: "Missing required fields",
        code: "Required fields",
      });
      return;
    }

    const group = await createGroupService(name, description, userId!);

    // after creating a group, delete the dashboard data cache
    if (group) {
       await redisClient.del(`dashboard:user:${userId}`);
    }

    res.status(201).json({
      success: true,
      message: "Group created successfully",
      data: group,
    });
  } catch (error: any) {
    console.error("CreateGroupController Error:", error);

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
