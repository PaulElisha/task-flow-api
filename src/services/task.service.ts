/** @format */

import Task from "../models/task.model.ts";
import Project from "../models/project.model.ts";
import Member from "../models/member.model.ts";

import {
  createTaskSchema,
  updateTaskSchema,
} from "../utils/schemas/task.schema.ts";
import { projectIdSchema } from "../utils/schemas/project.schema.ts";
import { workspaceIdSchema } from "../utils/schemas/workspace.schema.ts";
import { taskIdSchema } from "../utils/schemas/task.schema.ts";

import { Validator } from "../utils/validation/validator.ts";
import { ValidatorInstance } from "../types/utils/validator.types.ts";

import { NotFoundExceptionError } from "../errors/not-found-exception.error.ts";
import { HTTP_STATUS } from "../config/http.config.ts";
import { UnauthorizedExceptionError } from "../errors/unauthorized-exception.error.ts";

class TaskService {
  createTask = async (
    workspaceid: string,
    projectid: string,
    userId: string,
    body: {
      title: string;
      description: string;
      priority: string;
      status: string;
      assignedTo: string;
      deadline: string;
    }
  ) => {
    const { title, description, priority, status, assignedTo, deadline } = body;

    const project = await Project.findById(projectid);

    if (!project || project.workSpaceId.toString() !== workspaceid.toString())
      throw new NotFoundExceptionError(
        "Project not found or does not belong to this workspace",
        HTTP_STATUS.NOT_FOUND
      );

    if (assignedTo) {
      const isAssignedTo = await Member.exists({
        userId: assignedTo,
        workspaceid,
      });

      if (!isAssignedTo)
        throw new UnauthorizedExceptionError(
          "Assigned user is not a member of this workspace",
          HTTP_STATUS.UNAUTHORIZED
        );
    }

    const validator: ValidatorInstance = Validator.withSchemas({
      // user: userIdSchema,
      project: projectIdSchema,
      workspace: workspaceIdSchema,
      create: createTaskSchema,
    });

    // const userId = validator.user(userid);
    const projectId = validator.project(projectid);
    const workspaceId = validator.workspace(workspaceid);
    const v = validator.create({
      title,
      description,
      priority,
      status,
      assignedTo,
      deadline,
    });

    const task = await Task.create({
      ...v,
      userId,
      projectId,
      workspaceId,
    });

    return { task };
  };

  getTaskById = async (
    workSpaceId: string,
    projectId: string,
    taskId: string
  ) => {
    const project = await Project.findById(projectId);

    if (!project || project.workSpaceId.toString() !== workSpaceId.toString())
      throw new NotFoundExceptionError(
        "Project not found or does not belong to this workspace",
        HTTP_STATUS.NOT_FOUND
      );

    const task = Task.findOne({ _id: taskId, workSpaceId, projectId }).populate(
      "assignedTo",
      "_id name displayPicture -permissions"
    );

    if (!task)
      throw new NotFoundExceptionError("Task not found", HTTP_STATUS.NOT_FOUND);

    return { task };
  };

  deleteTask = async (workSpaceId: string, taskId: string) => {
    await Task.findOneAndDelete({ _id: taskId, workSpaceId });
    return;
  };

  updateTask = async (
    workspaceid: { toString: () => string },
    projectid: { toString: () => string },
    taskid: any,
    body: {
      title: any;
      description: any;
      priority: any;
      status: any;
      assignedTo: any;
      deadline: any;
    }
  ) => {
    const { title, description, priority, status, assignedTo, deadline } = body;

    const project = await Project.findById(projectid);

    if (!project || project.workSpaceId.toString() !== workspaceid.toString())
      throw new Error("Project does not exists in this workspace");

    let task = await Task.findById(taskid);

    if (!task || task.projectId.toString() !== projectid.toString())
      throw new Error("Task not found in this project");

    const validator: ValidatorInstance = Validator.withSchemas({
      taskIdSchema,
      updateTaskSchema,
    });

    const taskId = validator.taskIdSchema(taskid);
    const v = validator.updateTaskSchema({
      title,
      description,
      priority,
      status,
      assignedTo,
      deadline,
    });

    task = await Task.findByIdAndUpdate(
      { taskId },
      { $set: { ...v } },
      { new: true }
    );

    if (!task) throw new Error("Failed to update task");

    return { task };
  };

  getAllTasks = async (
    workspaceId: string,
    filters: {
      projectId: any;
      status: any;
      priority: any;
      assignedTo: any;
      keyword: any;
      deadline: any;
    },
    pagination: { pageSize: number; pageNumber: number }
  ) => {
    const query: Record<string, any> = {
      workspaceId: workspaceId,
    };

    if (filters.projectId) {
      query.projectId = filters.projectId;
    }

    if (filters.status && filters.status.length > 0) {
      query.status = { $in: filters.status };
    }

    if (filters.priority && filters.priority.length > 0) {
      query.priority = { $in: filters.priority };
    }

    if (filters.assignedTo && filters.assignedTo.length > 0) {
      query.assignedTo = { $in: filters.assignedTo };
    }

    if (filters.keyword && filters.keyword !== undefined) {
      query.title = { $regex: filters.keyword, $options: "i" };
    }

    if (filters.deadline) {
      query.deadline = {
        $eq: new Date(filters.deadline),
      };
    }

    const { pageSize, pageNumber } = pagination;

    const skip = (pageNumber - 1) * pageSize;

    const [tasks, totalCount] = await Promise.all([
      Task.find(query)
        .skip(skip)
        .limit(pageSize)
        .sort({ createdAt: -1 })
        .populate("assignedTo", "_id name displayPicture")
        .populate("project", "_id emoji name"),
      Task.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      tasks,
      pagination: {
        pageSize,
        pageNumber,
        totalCount,
        totalPages,
        skip,
      },
    };
  };
}

export { TaskService };
