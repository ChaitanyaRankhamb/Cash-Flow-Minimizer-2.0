import { Response } from "express";
import { AuthRequest } from "../../middleware/authMiddleware";
import { userRepository } from "../../database/mongo/user/userRepository";
import { UserId } from "../../entities/user/UserId";
import { appDataService } from "./services";
import { CashFlowAppData, guestDefaultData } from "./types";
import redisClient from "../../config/redis-connection";

export const appDataController = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const userId = req.userId;

    // create a chace key for dashboard data/ app data
    const dashboardChaceKey = `dashboard:user:${userId}`;

    const dashboardChaceData = await redisClient.get(dashboardChaceKey);

    if (dashboardChaceData) {
      return res.status(200).json({
        success: true,
        message: "app data fetched successfully through chace",
        data: JSON.parse(dashboardChaceData) as CashFlowAppData,
      })
    }

    // check userId existance
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Guest Mode",
        data: guestDefaultData,
      });
    }

    // 1️⃣ Check user existence
    const user = await userRepository.findUserByID(new UserId(userId));

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Guest Mode",
        data: guestDefaultData,
      });
    }

    const appdata: CashFlowAppData = await appDataService(new UserId(userId));

    // set appdata into redis 
    redisClient.set(dashboardChaceKey, JSON.stringify(appdata), {
      EX: 60, // 60 seconds
    });

    return res.status(200).json({
      success: true,
      message: "App data fetched successfully",
      data: appdata,
    });
  } catch (error: any) {
    console.error("App Data Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: guestDefaultData,
    });
  }
};
