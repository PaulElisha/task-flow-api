/** @format */

import Member from "../models/member.model.ts";
import User from "../models/user.model.ts";
import Project from "../models/project.model.ts";
import Task from "../models/task.model.ts";
import WorkSpace from "../models/workspace.model.ts";
import Role from "../models/role.model.ts";

import { Status } from "../enums/task-status.enum.ts";
import { Roles } from "../enums/role.enum.ts";

import mongoose from "mongoose";
import {
  createWorkspaceSchema,
  workspaceIdSchema,
} from "../utils/schemas/workspace.schema.ts";
import { Validator } from "../utils/validation/validator.ts";
import { NotFoundExceptionError } from "../errors/not-found-exception.error.ts";
import { HTTP_STATUS } from "../config/http.config.ts";
import { UnauthorizedExceptionError } from "../errors/unauthorized-exception.error.ts";

class WorkspaceService {
  createWorkspace = async (
    userid: mongoose.Types.ObjectId,
    body: { name: string; description: string }
  ) => {
    const { name, description } = body;

    const validator = Validator.withSchemas({
      workspaceIdSchema,
      createWorkspaceSchema,
    });

    let v;
    v = await validator.createWorkspaceSchema({
      name,
      description,
    });

    const user = await User.findById(userid);
    if (!user)
      throw new UnauthorizedExceptionError(
        "User not found",
        HTTP_STATUS.UNAUTHORIZED
      );

    const ownerRole = await Role.findOne({ type: Roles.OWNER });
    if (!ownerRole)
      throw new NotFoundExceptionError(
        "Owner role not found",
        HTTP_STATUS.NOT_FOUND
      );

    const workspace = await WorkSpace.create({
      userid,
      name: v.name,
      description: v.description,
    });

    const workSpaceId = await validator.workspaceIdSchema(workspace._id);

    await Member.create({
      userid,
      workSpaceId,
      role: ownerRole._id,
      joinedAt: new Date(),
    });

    user.currentWorkspace = workSpaceId;
    await user.save();

    return { workspace };
  };

  getAllWorkspacePerMember = async (userId: mongoose.Types.ObjectId) => {
    const members = await Member.find({ userId })
      .populate("workSpaceId")
      .select("-password")
      .exec();
    const workspaces = members.map((m) => m.workSpaceId);
    return { workspaces };
  };

  getWorkspaceMembers = async (workSpaceId: string) => {
    const members = await Member.find({ workSpaceId })
      .populate("userId", "name email displayPicture")
      .populate("role", "type");

    const roles = await Role.find({}, { type: 1, _id: -1 }).lean();

    return { members, roles };
  };

  getWorkspaceById = async (workSpaceId: string) => {
    const workspace = await WorkSpace.findById(workSpaceId).lean();

    if (!workspace)
      throw new NotFoundExceptionError(
        "Workspace not found",
        HTTP_STATUS.NOT_FOUND
      );

    const members = await Member.find({ workSpaceId }).populate("role");

    const workSpaceAndMembers = {
      workspace,
      ...members,
    };

    return { workSpaceAndMembers };
  };

  getWorkspaceAnalytics = async (workspaceId: string) => {
    const currentDate = new Date();

    const totalTasks = await Task.countDocuments({
      workspaceId,
    });

    const overdueTask = await Task.countDocuments({
      workspaceId,
      deadline: { $lt: { currentDate } },
      status: { $ne: Status.DONE },
    });

    const completedTasks = await Task.countDocuments({
      workspaceId,
      status: Status.DONE,
    });

    return { totalTasks, overdueTask, completedTasks };
  };

  changeMemberRole = async (
    workSpaceId: string,
    userId: string,
    roleId: string
  ) => {
    const workSpace = await WorkSpace.findById(workSpaceId);

    if (!workSpace) throw new Error("Workspace not found");

    const role = await Role.findById(roleId);
    if (!role) throw new Error("Role not found");

    const member = await Member.findOne({ userId });

    if (!member)
      throw new NotFoundExceptionError(
        "Member not found",
        HTTP_STATUS.NOT_FOUND
      );

    member.role = role._id as unknown as mongoose.Types.ObjectId;
    await member.save();
    return { member };
  };

  updateWorkspaceById = async (
    workSpaceId: string,
    name: string,
    description: string
  ) => {
    let workspace = await WorkSpace.findById(workSpaceId);

    if (!workspace)
      throw new NotFoundExceptionError(
        "Workspace not found",
        HTTP_STATUS.NOT_FOUND
      );

    workspace = await WorkSpace.findByIdAndUpdate(
      workSpaceId,
      {
        $set: {
          name: name,
          description: description,
        },
      },
      {
        new: true,
      }
    );

    return { workspace };
  };

  deleteWorkspaceById = async (
    workSpaceId: string,
    userId: mongoose.Types.ObjectId
  ) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const workspace = await WorkSpace.findById(workSpaceId).session(session);

      if (!workspace)
        throw new NotFoundExceptionError(
          "Workspace not found",
          HTTP_STATUS.NOT_FOUND
        );

      if (!workspace.userId.equals(userId))
        throw new UnauthorizedExceptionError(
          "Unauthorized to delete workspace",
          HTTP_STATUS.UNAUTHORIZED
        );

      const user = await User.findById(userId).session(session);
      if (!user)
        throw new NotFoundExceptionError(
          "User not found",
          HTTP_STATUS.NOT_FOUND
        );

      await Project.deleteMany({ workSpaceId: workspace._id }).session(session);

      await Task.deleteMany({ workSpaceId: workspace._id }).session(session);

      await Member.deleteMany({ workspaceId: workspace._id }).session(session);

      if (user?.currentWorkspace?.equals(workSpaceId)) {
        const memberWorkspace = await Member.findOne({
          userId: userId,
          workspaceId: { $ne: workSpaceId },
        }).session(session);

        user.currentWorkspace = memberWorkspace
          ? (memberWorkspace.workSpaceId as any)
          : null;
        await user.save({ session });
      }

      await workspace.deleteOne({ session });

      session.commitTransaction();

      session.endSession();

      return { workspace: user.currentWorkspace };
    } catch (error) {
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  };
}

export { WorkspaceService };
