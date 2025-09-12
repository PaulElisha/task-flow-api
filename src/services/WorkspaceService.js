/** @format */

import Member from "../models/Member";
import User from "../models/User";
import Project from "../models/Project";
import Task, { Status } from "../models/Task";
import Workspace from "../models/Workspace";
import Role, { Roles } from "../models/Role";
import mongoose from "mongoose";

class WorkspaceService {
    createWorkspace = async ({ userId, body }) => {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const ownerRole = Role.findOne({ type: Roles.OWNER });
        if (!ownerRole) throw new Error("Owner role not found");

        let error;
        error = Workspace.validate({
            userId,
            name: body.name,
            description: body.description,
        });
        if (error) throw new Error(error.message);

        const workspace = await Workspace.create({
            userId,
            name: body.name,
            description: body.description,
        });

        error = Member.validate({
            userId: user._id,
            workspaceId: workspace._id,
            role: ownerRole._id,
        });
        if (error) throw new Error(error.message);

        const member = await Member.create({
            userId: user._id,
            workspaceId: workspace._id,
            role: ownerRole._id,
        });

        return { workspace };
    };

    getAllWorkspacePerMember = async (userId) => {
        const members = await Member.find({ userId }).populate("workSpaceId");
        const workspaces = members.map((m) => m.workSpaceId);
        return { workspaces };
    };

    getWorkspaceMembers = async (workSpaceId) => {
        const members = await Member.find({ workSpaceId })
            .populate("userId", "name email displayPicture")
            .populate("role", "type");

        const roles = await Role.find({}, { name: 1, _id: 1 })
            .select("-permissions")
            .lean();

        return { members, roles };
    };

    getWorkspaceById = async (workSpaceId) => {
        const workspace = await Workspace.findById(workSpaceId).lean();

        if (!workspace) {
            throw new Error("Workspace not found");
        }

        const members = await Member.find({ workSpaceId }).populate("role");

        const workSpaceAndMembers = {
            ...workspace,
            members,
        };

        return { workSpaceAndMembers };
    };

    getWorkspaceAnalytics = async (workspaceId) => {
        const currentDate = new Date();

        const totalTasks = await Task.countDocuments({ workspaceId });

        const overdueTask = await Task.countDocuments({
            workspaceId,
            deadline: { $lt: { currentDate } },
            status: { $ne: Status.DONE }
        });

        const completedTasks = await Task.countDocuments({
            workspaceId,
            status: Status.DONE
        })

        return { totalTasks, overdueTask, completedTasks };
    }

    changeMemberRole = async (workSpaceId, memberId, roleId) => {
        const workSpace = await Workspace.findById(workSpaceId);

        if (!workSpace) {
            throw new Error("Workspace not found");
        }

        const role = await Role.findById(roleId);
        if (!role) {
            throw new Error("Role not found");
        }

        let member;
        member = await Member.findOne({ userId: memberId, workSpaceId });

        if (!member) {
            throw new Error("Member not found in the workspace");
        }

        member = await Member.findByIdAndUpdate(
            { memberId },
            { $set: { role: role } },
            { new: true }
        );
        return { member };
    };

    updateWorkspaceById = async (workSpaceId, name, description) => {
        let workspace = await Workspace.findById(workSpaceId);

        if (workspace) {
            throw new Error("Workspace not found");
        }

        workspace = await Workspace.findByIdAndUpdate(
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
            const workspace = await Workspace.findById(workSpaceId).session(session);

            if (!workspace) {
                throw new Error("Workspace not found");
            }

            if (workspace.userId.equals(new mongoose.Types.ObjectId(userId))) {
                throw new Error("Unauthorized to delete workspace");
            }

            const user = await User.findById(userId).session(session);
            if (!user) {
                throw new Error("User not found");
            }

            await Project.deleteMany({ workSpaceId }).session(session);

            await Task.deleteMany({ workSpaceId }).session(session);

            await Member.deleteMany({ workSpaceId }).session(session);

            await workspace.deleteOne({ session });

            session.commitTransaction();

            session.endSession();

            return;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    };
}

export { WorkspaceService };
