import { groupRepository } from "../../../../database/mongo/group/groupRepository";
import { GroupId } from "../../../../entities/group/GroupId";
import { UserId } from "../../../../entities/user/UserId";
import { AppError } from "../../../../errors/appError";

export const deleteGroupService = async (
  groupId: GroupId,
  userId: UserId
): Promise<void> => {

  const existing = await groupRepository.findGroupById(groupId);

  if (!existing) {
    throw new AppError(
      "Group not found",
      404,
      "GROUP_NOT_FOUND"
    );
  }

  if (existing.createdBy.toString() !== userId.toString()) {
    throw new AppError(
      "You are not authorized to delete this group",
      403,
      "FORBIDDEN"
    );
  }

  await groupRepository.deleteGroup(groupId);
};