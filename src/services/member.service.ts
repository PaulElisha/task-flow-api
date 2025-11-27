/** @format */

import Member from "../models/member.model.ts";
import Workspace from "../models/workspace.model.ts";
import Role from "../models/role.model.ts";

import { Roles } from "../enums/role.enum.ts";

import { Validator } from "../utils/validation/validator.ts";
import { workspaceIdSchema } from "../utils/schemas/workspace.schema.ts";
import mongoose from "mongoose";
import { NotFoundExceptionError } from "../errors/not-found-exception.error.ts";
import { HTTP_STATUS } from "../config/http.config.ts";
import { UnauthorizedExceptionError } from "../errors/unauthorized-exception.error.ts";
import { BadRequestExceptionError } from "../errors/bad-request.error.ts";

class MemberService {
  getMemberRoleInWorkspace = async (
    userId: mongoose.Types.ObjectId,
    workSpaceId: string
  ) => {
    const workspace = await Workspace.findById(workSpaceId);
    if (!workspace)
      throw new NotFoundExceptionError(
        "Workspace not found",
        HTTP_STATUS.NOT_FOUND
      );

    const member = await Member.findOne({ userId, workSpaceId }).populate(
      "role"
    );

    if (!member)
      throw new UnauthorizedExceptionError(
        "Member not found in the specified workspace",
        HTTP_STATUS.NOT_FOUND
      );

    const roleType = (member.role as any)?.type;
    return { role: roleType };
  };

  joinWorkspaceByInviteCode = async (
    userId: mongoose.Types.ObjectId,
    inviteCode: string
  ) => {
    const workspace = await Workspace.findOne({ inviteCode }).exec();
    if (!workspace) throw new Error("Invalid invite code");

    const validator = Validator.withSchemas({
      workspaceIdSchema,
    });

    const workSpaceId = await validator.workspaceIdSchema(workspace._id);

    const member = await Member.findOne({
      userId,
      workSpaceId,
    }).exec();

    if (member)
      throw new BadRequestExceptionError(
        "User is already a member of this workspace",
        HTTP_STATUS.BAD_REQUEST
      );

    const role = await Role.findOne({ type: Roles.MEMBER });

    if (!role)
      throw new NotFoundExceptionError("Role not found", HTTP_STATUS.NOT_FOUND);

    await Member.create({
      userId,
      workSpaceId,
      role: role._id,
    });

    return { workspaceId: workspace._id, type: role.type };
  };
}

export { MemberService };
