import { UserId } from "../user/UserId";
import { Group } from "./Group";
import { GroupId } from "./GroupId";
import { GroupMember, GroupRole } from "./GroupMember";

export interface CreateGroupData {
  name: string;
  description?: string;
  createdBy: UserId;
}

export interface UpdateGroupData {
  groupId: GroupId;
  name?: string;
  description?: string;
}

export interface AddGroupMemberData {
  groupId: GroupId;
  userId: UserId;
  role: GroupRole;
}

export interface UpdateGroupMemberRoleData {
  groupId: GroupId;
  userId: UserId;
  role: GroupRole;
}

export interface RemoveGroupMemberData {
  groupId: GroupId;
  userId: UserId;
}

export interface GroupRepository {
  exists(groupId: GroupId) : Promise<boolean>;

  createGroup(data: CreateGroupData): Promise<Group>;

  findGroupById(groupId: GroupId): Promise<Group | null>;

  findGroupByName(name: string): Promise<Group | null>;

  findGroupsByUser(userId: UserId): Promise<Group[]>;

  updateGroup(data: UpdateGroupData): Promise<Group>;

  deleteGroup(groupId: GroupId): Promise<Group | null>;

  addGroupMember(data: AddGroupMemberData): Promise<GroupMember>;

  findGroupMembersForUser(userId: UserId): Promise<GroupMember[] | null>;

  findGroupMember(
    groupId: GroupId,
    userId: UserId
  ): Promise<GroupMember | null>;

  findAllGroupMembers(
    groupId: GroupId
  ): Promise<GroupMember[] | null>;

  updateGroupMemberRole(
    data: UpdateGroupMemberRoleData
  ): Promise<GroupMember>;

  removeGroupMember(
    data: RemoveGroupMemberData
  ): Promise<void>;
}