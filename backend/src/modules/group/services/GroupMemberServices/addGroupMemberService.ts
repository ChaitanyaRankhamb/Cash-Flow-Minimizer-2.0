import { groupRepository } from "../../../../database/mongo/group/groupRepository";
import { userRepository } from "../../../../database/mongo/user/userRepository";
import { GroupId } from "../../../../entities/group/GroupId";
import { GroupMember, GroupRole } from "../../../../entities/group/GroupMember";
import { AppError } from "../../../../errors/appError";

export const addGroupMemberService = async (
  groupId: string,
  email: string,
  role?: GroupRole | string
): Promise<GroupMember> => {
  const groupExists = await groupRepository.exists(new GroupId(groupId));

  if (!groupExists) {
    throw new AppError(
      "Group not found",
      404,
      "GROUP_NOT_FOUND"
    );
  }

  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw new AppError(
      "User with this email not found",
      404,
      "USER_NOT_FOUND"
    );
  }

  const existingMember = await groupRepository.findGroupMember(
    new GroupId(groupId),
    user.id
  );

  if (existingMember) {
    throw new AppError(
      "User is already a group member",
      409,
      "MEMBER_ALREADY_EXISTS"
    );
  }

  const groupMember = await groupRepository.addGroupMember({
    groupId: new GroupId(groupId),
    userId: user.id,
    role:
      role && Object.values(GroupRole).includes(role as GroupRole)
        ? (role as GroupRole)
        : GroupRole.MEMBER,
  });

  return groupMember;
};