import { groupRepository } from "../../../database/mongo/group/groupRepository";
import { Group } from "../../../entities/group/Group";
import { UserId } from "../../../entities/user/UserId";

export const loadUserGroups = async (userId: UserId): Promise<Group[]> => {
  const groupMembers = await groupRepository.findGroupMembersForUser(userId);

  const groups: Group[] = [];

  for (const member of groupMembers ?? []) {
    const group = await groupRepository.findGroupById(member._groupId);
    if (group) groups.push(group);
  }

  return groups;
};
