/** @format */

import mongoose from "mongoose";
import Project from "../models/Project.js";
import Task, { Status } from "../models/Task.js";

import {
  projectIdSchema,
  createProjectSchema,
  updateProjectSchema,
} from "../utils/validation/schemas/projectSchema.js";
import { workspaceIdSchema } from "../utils/validation/schemas/workspaceSchema.js";

import { Validator } from "../utils/validation/Validator.js";

class ProjectService {
  createProject = async (workspaceid, userid, body) => {
    const { emoji, name, description, deadline } = body;

    const validator = Validator.withSchemas({
      user: userIdSchema,
      workspace: workspaceIdSchema,
      create: createProjectSchema,
    });

    const userId = await validator.user(userid);
    const workSpaceId = await validator.workspace(workspaceid);

    const v = await validator.create({
      name,
      emoji,
      description,
      deadline,
    });

    const project = await Project.create({
      ...(v.emoji && { emoji: v.emoji }),
      name: v.name,
      description: v.description,
      deadline: v.deadline,
      workSpaceId,
      userId,
    });

    return { project };
  };

  getProjectsInWorkspace = async (workSpaceId, pageSize, pageNumber) => {
    const totalCount = await Project.countDocuments({ workSpaceId });

    const skip = (pageNumber - 1) * pageSize;

    const projects = await Project.find({ workSpaceId })
      .skip(skip)
      .limit(pageSize)
      .populate("userId", "_id name displayPicture -password")
      .sort({ createdAt: -1 });

    const totalPages = Math.ceil(totalCount / pageSize);

    return { projects, totalCount, totalPages, skip };
  };

  getProjectsByIdAndWorkspaceId = async (workSpaceId, projectId) => {
    const project = await Project.findOne({ projectId, workSpaceId }).select(
      "_id emoji name description"
    );

    if (!project && project.workSpaceId.toString() !== workSpaceId.toString())
      throw new Error("Project does not exist in workspace");

    return { project };
  };

  getProjectAnalytics = async (workSpaceId, projectId) => {
    const project = await Project.findById(projectId);

    if (!project || project.workSpaceId.toString() !== workSpaceId.toString()) {
      throw new Error("Project not found in workspace");
    }
    const currentDate = new Date();

    const taskAnalytics = await Task.aggregate([
      {
        $match: {
          project: mongoose.Types.ObjectId(projectId),
        },
      },
      {
        $facet: {
          totalTasks: [{ $count: "count" }],
          overdueTasks: [
            {
              $match: {
                deadline: { $lt: currentDate },
                status: {
                  $ne: Status.TODO,
                },
              },
            },
            {
              $count: "count",
            },
          ],
          completedTasks: [
            {
              $match: {
                status: Status.TODO,
              },
            },
            { $count: "count" },
          ],
        },
      },
    ]);

    const _analytics = taskAnalytics[0];

    const analytics = {
      totalTasks: _analytics.totalTasks[0]?.count || 0,
      overdueTasks: _analytics.overdueTasks[0]?.count || 0,
      completedTasks: _analytics.completedTasks[0]?.count || 0,
    };

    return {
      analytics,
    };
  };

  updateProject = async (workspaceid, projectid, body) => {
    const { name, emoji, description, deadline } = body;

    const validator = Validator.withSchemas({
      project: projectIdSchema,
      workspace: workspaceIdSchema,
      update: updateProjectSchema,
    });

    const projectId = await validator.project(projectid);

    const workSpaceId = await validator.workspace(workspaceid);

    const v = await validator.update({
      name,
      emoji,
      description,
      deadline,
    });

    const project = await Project.findOneAndUpdate(
      { _id: projectId, workSpaceId },
      { $set: { name: v.name, emoji: v.emoji, description: v.description } },
      { new: true }
    );

    return { project };
  };

  deleteProject = async (workSpaceId, projectId) => {
    const project = await Project.findOne({ _id: projectId, workSpaceId });

    if (project) throw new Error("Project not found in workspace");

    await project.deleteOne();

    await Task.deleteMany({ projectId: project._id });
  };
}

export { ProjectService };
