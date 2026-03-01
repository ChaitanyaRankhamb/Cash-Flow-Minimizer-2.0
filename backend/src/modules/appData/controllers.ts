import { Response } from "express";
import { AuthRequest } from "../../middleware/authMiddleware";
import { userRepository } from "../../database/mongo/user/userRepository";
import { UserId } from "../../entities/user/UserId";
import { appDataService } from "./services";
import { CashFlowAppData, guestDefaultData } from "./types";

export const appDataController = async (
  req: AuthRequest,
  res: Response,
): Promise<Response> => {
  try {
    const userId = req.userId;

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

    const appdata: CashFlowAppData = await appDataService(new UserId(userId), res);

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
