import { groupRepository } from "../../../../database/mongo/group/groupRepository";
import { Group } from "../../../../entities/group/Group";
import { GroupId } from "../../../../entities/group/GroupId";
import { UserId } from "../../../../entities/user/UserId";
import { AppError } from "../../../../errors/appError";

interface UpdateGroupPayload {
  name?: string;
  description?: string;
}

export const updateGroupService = async (
  userId: UserId,
  groupId: GroupId,
  data: UpdateGroupPayload
): Promise<Group> => {

  if (!data.name && !data.description) {
    throw new AppError(
      "Nothing to update",
      400,
      "NOTHING_TO_UPDATE"
    );
  }

  const existingGroup = await groupRepository.findGroupById(groupId);
  if (!existingGroup) {
    throw new AppError(
      "Group not found",
      404,
      "GROUP_NOT_FOUND"
    );
  }

  const isMember = await groupRepository.findGroupMember(groupId, userId);
  if (!isMember) {
    throw new AppError(
      "User is not authorized to update this group",
      403,
      "FORBIDDEN"
    );
  }

  if (isMember._role !== "ADMIN") {
    throw new AppError(
      "Only admin can update the group",
      403,
      "USER_IS_NOT_ADMIN"
    )
  }

  const updatedGroup = await groupRepository.updateGroup({
    groupId,
    ...(data.name !== undefined && { name: data.name }),
    ...(data.description !== undefined && { description: data.description }),
  });

  if (!updatedGroup) {
    throw new AppError(
      "Failed to update group",
      500,
      "GROUP_UPDATE_FAILED"
    );
  }

  return updatedGroup;
};