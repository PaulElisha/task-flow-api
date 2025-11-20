/** @format */

import Member from "../models/Member.js";
import User from "../models/User.js";
import Project from "../models/Project.js";
import Task, { Status } from "../models/Task.js";
import WorkSpace from "../models/Workspace.js";
import Role, { Roles } from "../models/Role.js";
import mongoose from "mongoose";
import {
  createWorkspaceSchema,
  workspaceIdSchema,
} from "../utils/validation/schemas/workspaceSchema.js";
import { Validator } from "../utils/validation/Validator.js";

class WorkspaceService {
  createWorkspace = async ({ userid, body }) => {
    const { name, description } = body;

    const user = await User.findById(userid);
    if (!user) throw new Error("User not found");

    const ownerRole = Role.findOne({ type: Roles.OWNER });
    if (!ownerRole) throw new Error("Owner role not found");

    const validator = Validator.withSchemas({
      user: userIdSchema,
      workspace: workspaceIdSchema,
      create: createWorkspaceSchema,
    });

    const userId = await validator.user(userid);

    let v;
    v = await validator.create({
      userId,
      name,
      description,
    });

    const workspace = await WorkSpace.create({
      userId,
      name: v.name,
      description: v.description,
    });

    const workSpaceId = await validator.workspace(workspace._id);

    await Member.create({
      userId,
      workSpaceId,
      role: ownerRole._id,
    });

    user.currentWorkspace = workSpaceId;
    await user.save();

    return { workspace };
  };

  getAllWorkspacePerMember = async (userId) => {
    const members = await Member.find({ userId })
      .populate("workSpaceId")
      .select("-password")
      .exec();
    const workspaces = members.map((m) => m.workSpaceId);
    return { workspaces };
  };

  getWorkspaceMembers = async (workSpaceId) => {
    const members = await Member.find({ workSpaceId })
      .populate("userId", "name email displayPicture")
      .populate("role", "type");

    const roles = await Role.find({}, { type: 1, _id: -1 }).lean();

    return { members, roles };
  };

  getWorkspaceById = async (workSpaceId) => {
    const workspace = await WorkSpace.findById(workSpaceId).lean();

    if (!workspace) throw new Error("Workspace not found");

    const members = await Member.find({ workSpaceId }).populate("role");

    const workSpaceAndMembers = {
      workspace,
      ...members,
    };

    return { workSpaceAndMembers };
  };

  getWorkspaceAnalytics = async (workspaceId) => {
    const currentDate = new Date();

    const totalTasks = await Task.countDocuments({ workspaceId });

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

  changeMemberRole = async (workSpaceId, userId, roleId) => {
    const workSpace = await WorkSpace.findById(workSpaceId);

    if (!workSpace) throw new Error("Workspace not found");

    const role = await Role.findById(roleId);
    if (!role) throw new Error("Role not found");

    let member;
    member = await Member.findOne({ userId });

    if (!member) throw new Error("Member not found in the workspace");

    member = await Member.findOneAndUpdate(
      { userId },
      { $set: { role: role } },
      { new: true }
    );
    return { member };
  };

  updateWorkspaceById = async (workSpaceId, name, description) => {
    let workspace = await WorkSpace.findById(workSpaceId);

    if (workspace) throw new Error("Workspace not found");

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

  deleteWorkspaceById = async (workSpaceId, userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const workspace = await WorkSpace.findById(workSpaceId).session(session);

      if (!workspace) throw new Error("Workspace not found");

      if (workspace.userId.equals(mongoose.Types.ObjectId(userId)))
        throw new Error("Unauthorized to delete workspace");

      const user = await User.findById(userId).session(session);
      if (!user) throw new Error("User not found");

      await Project.deleteMany({ workSpaceId }).session(session);

      await Task.deleteMany({ workSpaceId }).session(session);

      await Member.deleteMany({ workSpaceId }).session(session);

      await workspace.deleteOne({ session });

      session.commitTransaction();

      session.endSession();

      return;
    } catch (error) {
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  };
}

export { WorkspaceService };
