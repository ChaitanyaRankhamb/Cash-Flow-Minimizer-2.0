import { groupRepository } from "../../../../database/mongo/group/groupRepository";
import { Group } from "../../../../entities/group/Group";
import { GroupId } from "../../../../entities/group/GroupId";
import { GroupRole } from "../../../../entities/group/GroupMember";
import { UserId } from "../../../../entities/user/UserId";
import { AppError } from "../../../../errors/appError";



export const createGroupService = async (
  name: string,
  description: string | undefined,
  userId: string,
): Promise<Group> => {
  if (!name?.trim()) {
    throw new AppError("Group name is required", 400, "GROUP_NAME_REQUIRED");
  }

  if (!userId) {
    throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  }

  try {
    const createdBy = new UserId(userId);

    // OPTIONAL: Check duplicate name per user
    const existing = await groupRepository.findGroupByName?.(
      name.trim(),
    );

    if (existing) {
      throw new AppError(
        "A group with this name already exists",
        409,
        "GROUP_ALREADY_EXISTS",
      );
    }

    const group = await groupRepository.createGroup({
      name: name.trim(),
      ...(description && { description: description.trim() }),
      createdBy,
    });

    try {
      await groupRepository.addGroupMember({
        groupId: group.id,
        userId: createdBy,
        role: GroupRole.ADMIN,
      });
    } catch (memberError) {
      // rollback group if member creation fails
      await groupRepository.deleteGroup(group.id);
      throw new AppError(
        "Failed to initialize group membership",
        500,
        "GROUP_MEMBER_CREATION_FAILED",
      );
    }

    return group;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    console.error("CreateGroupService Error:", error);

    throw new AppError(
      "Unable to create group",
      500,
      "GROUP_CREATION_FAILED",
    );
  }
};

