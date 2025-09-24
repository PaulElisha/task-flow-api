/** @format */

import Member from "../models/Member";
import Workspace from "../models/Workspace";
import Role, { Roles } from "../models/Role";

import Validator from "../utils/validation/validator";

class MemberService {
  getMemberRoleInWorkspace = async (userId, workSpaceId) => {
    const workspace = await Workspace.findById(workSpaceId);
    if (!workspace) throw new Error("Workspace not found");

    const member = await Member.findOne({ userId, workSpaceId }).populate(
      "role"
    );

    if (!member) throw new Error("Member not found in the specified workspace");

    const roleType = member && member.role.type;
    return roleType;
  };

  joinWorkspaceByInviteCode = async (userid, inviteCode) => {
    const workspace = await Workspace.findOne({ inviteCode }).exec();
    if (!workspace) throw new Error("Invalid invite code");

    const validator = Validator.withSchemas({
      user: userIdSchema,
      workspace: workspaceIdSchema,
    });

    const userId = await validator.user(userid);
    const workSpaceId = await validator.workspace(workspace._id);

    const member = await Member.findOne({
      userId,
      workSpaceId,
    }).exec();

    if (member) throw new Error("User is already a member of this workspace");

    const role = await Role.findOne({ type: Roles.MEMBER });

    if (!role) throw new Error("Member role not found");

    await Member.create({
      userId,
      workSpaceId,
      role: role._id,
    });

    return { workspaceId: workspace._id, type: role.type };
  };
}

export { MemberService };
