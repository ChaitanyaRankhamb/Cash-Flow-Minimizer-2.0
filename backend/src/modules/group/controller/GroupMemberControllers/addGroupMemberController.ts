import { Request, Response } from "express";
import { addGroupMemberService } from "../../services/GroupMemberServices/addGroupMemberService";
import { AuthRequest } from "../../../../middleware/authMiddleware";
import { GroupId } from "../../../../entities/group/GroupId";
import { AppError } from "../../../../errors/appError";

export const addGroupMemberController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { groupId } = req.params;
    const { email, role } = req.body ?? {};

    if (!groupId || !email) {
      res.status(400).json({
        success: false,
        message: "Missing required fields",
        code: "REQUIRED_FIELDS_MISSING",
      });
      return;
    }

    const member = await addGroupMemberService(groupId.toString(), email, role);

    res.status(201).json({
      success: true,
      message: "Group member added successfully",
      data: member,
    });
  } catch (error: any) {
    console.error("AddGroupMemberController Error:", error);

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