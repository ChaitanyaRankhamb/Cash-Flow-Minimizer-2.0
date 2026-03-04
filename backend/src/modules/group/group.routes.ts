import express from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { addGroupMemberController } from "./controller/GroupMemberControllers/addGroupMemberController";
import { getGroupMemberController } from "./controller/GroupMemberControllers/getGroupMemberController";
import { getAllGroupMembersController } from "./controller/GroupMemberControllers/getAllGroupMembersController";
import { updateGroupMemberRoleController } from "./controller/GroupMemberControllers/updateGroupMemberRoleController";
import { removeGroupMemberController } from "./controller/GroupMemberControllers/removeGroupMemberController";
import { createGroupController } from "./controller/GroupControllers/createGroupController";
import { getGroupController } from "./controller/GroupControllers/getGroupController";
import { updateGroupController } from "./controller/GroupControllers/updateGroupController";
import { deleteGroupController } from "./controller/GroupControllers/deleteGroupControllet";

const router = express.Router();

// Apply authMiddleware to all group routes
router.use(authMiddleware);

// create group
router.post("/", createGroupController);

// get groups
router.get("/", getGroupController);

// add group member
router.post("/:groupId/members", addGroupMemberController);

// get a specific group member
router.get("/:groupId/members/:userId", getGroupMemberController);

// get all members of a group
router.get("/:groupId/members", getAllGroupMembersController);

// update group
router.patch("/:groupId", updateGroupController);

// delete group
router.delete("/:groupId", deleteGroupController);

// update group member role
router.patch("/:groupId/members/:userId", updateGroupMemberRoleController);

// delete group member
router.delete("/:groupId/members/:userId", removeGroupMemberController);

export default router;
