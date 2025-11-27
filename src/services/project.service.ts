/** @format */

import mongoose from "mongoose";
import Project from "../models/project.model.ts";
import Task from "../models/task.model.ts";

import { Status } from "../enums/task-status.enum.ts";

import {
  projectIdSchema,
  createProjectSchema,
  updateProjectSchema,
} from "../utils/schemas/project.schema.ts";
import { workspaceIdSchema } from "../utils/schemas/workspace.schema.ts";

import { Validator } from "../utils/validation/validator.ts";
import { NotFoundExceptionError } from "../errors/not-found-exception.error.ts";
import { HTTP_STATUS } from "../config/http.config.ts";
import { InternalServerError } from "../errors/internal-server.error.ts";

class ProjectService {
  createProject = async (
    userid: mongoose.Types.ObjectId,
    workspaceid: string,
    body: {
      emoji?: string;
      name: string;
      description?: string;
    }
  ) => {
    const { emoji, name, description } = body;

    const validator = Validator.withSchemas({
      workspaceIdSchema,
      createProjectSchema,
    });

    const workSpaceId = await validator.workspaceIdSchema(workspaceid);

    const v = await validator.createProjectSchema({
      name,
      emoji,
      description,
    });

    const project = await Project.create({
      ...(v.emoji && { emoji: v.emoji }),
      name: v.name,
      description: v.description,
      workSpaceId,
      userId: userid,
    });

    return { project };
  };

  getProjectsInWorkspace = async (
    workSpaceId: string,
    pageSize: number,
    pageNumber: number
  ) => {
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

  getProjectsByIdAndWorkspaceId = async (
    workSpaceId: string,
    projectId: string
  ) => {
    const project = await Project.findOne({
      _id: projectId,
      workSpaceId,
    }).select("_id emoji name description");

    if (!project || project.workSpaceId.toString() !== workSpaceId.toString())
      throw new NotFoundExceptionError(
        "Project not found in workspace",
        HTTP_STATUS.NOT_FOUND
      );

    return { project };
  };

  getProjectAnalytics = async (workSpaceId: string, projectId: string) => {
    const project = await Project.findById(projectId);

    if (!project || project.workSpaceId.toString() !== workSpaceId.toString()) {
      throw new NotFoundExceptionError(
        "Project not found in workspace",
        HTTP_STATUS.NOT_FOUND
      );
    }
    const currentDate = new Date();

    const taskAnalytics = await Task.aggregate([
      {
        $match: {
          project: new mongoose.Types.ObjectId(projectId),
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

  updateProject = async (
    workspaceid: string,
    projectid: string,
    body: {
      name: string;
      emoji: string;
      description: string;
      deadline: Date;
    }
  ) => {
    const { name, emoji, description, deadline } = body;

    const validator = Validator.withSchemas({
      projectIdSchema,
      workspaceIdSchema,
      updateProjectSchema,
    });

    const projectId = await validator.projectIdSchema(projectid);

    const workSpaceId = await validator.workspaceIdSchema(workspaceid);

    const v = await validator.updateProjectSchema({
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

    if (!project)
      throw new InternalServerError(
        "Failed to update project",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );

    return { project };
  };

  deleteProject = async (workSpaceId: string, projectId: string) => {
    const project = await Project.findOne({ _id: projectId, workSpaceId });

    if (!project)
      throw new InternalServerError(
        "Failed to delete project",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );

    await project.deleteOne();

    await Task.deleteMany({ projectId: project._id });
  };
}

export { ProjectService };
