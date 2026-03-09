import { AuthRequest } from "../../middleware/authMiddleware";
import { Response } from "express";
import { GroupId } from "../../entities/group/GroupId";
import { UserId } from "../../entities/user/UserId";
import { SuggestionId } from "../../entities/settled/SuggestionId";
import { ConfirmSettlementService } from "./suggestionSettlement.service";
import redisClient from "../../config/redis-connection";

export const ConfirmSuggestionSettlementController = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    // check user validation
    if (!req.userId) {
      res.status(401).json({ message: "Unauthorized user" });
      return;
    }

    // check groupId
    const { groupId } = req.params;
    if (!groupId) {
      res.status(400).json({ message: "GroupId is required" });
      return;
    }

    // check body validation
    const { suggestionId } = req.params;
    if (!suggestionId) {
      res.status(400).json({ message: "SuggestionId is required" });
      return;
    }

    const { paymentMethod } = (req.body ?? {}) as { paymentMethod?: string };
    // default to 'cash' when frontend does not provide a payment method
    const finalPaymentMethod = paymentMethod ?? "cash";

    const settlement = await ConfirmSettlementService(
      new GroupId(groupId.toString()),
      new SuggestionId(suggestionId as string),
      new UserId(req.userId),
      finalPaymentMethod,
    );

    if (!settlement) {
      res.status(409).json({
        message: "Suggestion already settled or invalid",
      });
      return;
    }

    // delete app data cache after suggestion settled
    if (settlement) await redisClient.del(`dashboard:user:${req.userId}`);

    res.status(201).json({
      message: "Suggestion settled successfully",
      data: settlement,
    });
  } catch (error: any) {
    console.error("error", error);

    switch (error.name) {
      case "GroupNotFoundError":
        res.status(404).json({ message: error.message });
        return;

      case "UserNotGroupMemberError":
        res.status(403).json({ message: error.message });
        return;

      case "SuggestionNotFoundError":
        res.status(404).json({ message: error.message });
        return;

      case "SuggestionGroupMismatchError":
        res.status(403).json({ message: error.message });
        return;

      case "SuggestionAlreadySettledError":
        res.status(409).json({ message: error.message });
        return;

      case "SettlementConfirmationForbiddenError":
        res.status(403).json({ message: error.message });
        return;

      case "SettlementCreationFailedError":
        res.status(500).json({ message: error.message });
        return;
    }

    res.status(500).json({
      message: "Failed to confirm settlement",
      error: error.message ?? "Internal server error",
    });
  }
};
