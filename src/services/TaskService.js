/** @format */

import Task from "../models/Task.js";
import Project from "../models/Project.js";
import Member from "../models/Member.js";

import {
  createTaskSchema,
  updateTaskSchema,
} from "../utils/validation/schemas/taskSchema.js";
import { projectIdSchema } from "../utils/validation/schemas/projectSchema.js";
import { workspaceIdSchema } from "../utils/validation/schemas/workspaceSchema.js";
import { taskIdSchema } from "../utils/validation/schemas/taskSchema.js";

import { Validator } from "../utils/validation/Validator.js";

class TaskService {
  createTask = async (workspaceid, userid, projectid, body) => {
    const { title, description, priority, status, assignedTo, deadline } = body;

    const project = await Project.findById(projectid);

    if (!project || project.workSpaceId.toString() !== workspaceid.toString())
      throw new Error("Project not found or does not belong to this workspace");

    if (assignedTo) {
      const isAssignedTo = await Member.exists({
        userId: assignedTo,
        workspaceid,
      });

      if (!isAssignedTo)
        throw new Error("Assigned user is not a member of this workspace");
    }

    const validator = Validator.withSchemas({
      user: userIdSchema,
      project: projectIdSchema,
      workspace: workspaceIdSchema,
      create: createTaskSchema,
    });

    const userId = validator.user(userid);
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

    const task = await Task.create({ ...v, userId, projectId, workspaceId });

    return { task };
  };

  getTaskById = async (workSpaceId, projectId, taskId) => {
    const project = Project.findById(projectId);

    if (!project || project.workSpaceId.toString() !== workSpaceId.toString())
      throw new Error("Project does not exists in this workspace");

    const task = Task.findOne({ _id: taskId, workSpaceId, projectId }).populate(
      "assignedTo",
      "_id name displayPicture -permissions"
    );

    if (!task) throw new Error("Task not found");

    return { task };
  };

  deleteTask = async (workSpaceId, taskId) => {
    await Task.findOneAndDelete({ _id: taskId, workSpaceId });
    return;
  };

  updateTask = async (workspaceid, projectid, taskid, body) => {
    const { title, description, priority, status, assignedTo, deadline } = body;

    const project = await Project.findById(projectid);

    if (!project || project.workSpaceId.toString() !== workspaceid.toString())
      throw new Error("Project does not exists in this workspace");

    let task = await Task.findById(taskid);

    if (!task || task.projectId.toString() !== projectid.toString())
      throw new Error("Task not found in this project");

    const validator = Validator.withSchemas({
      user: userIdSchema,
      task: taskIdSchema,
      update: updateTaskSchema,
    });

    const taskId = validator.task(taskId);
    const v = validator.update({
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

  getAllTasks = async (workSpaceId, filters, pagination) => {
    const query = {
      workspace: workSpaceId,
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

    const [tasks, totalCount] = await Promise.all(
      TaskModel.find(query)
        .skip(skip)
        .limit(pageSize)
        .sort({ createdAt: -1 })
        .populate("assignedTo", "_id name displayPicture")
        .populate("project", "_id emoji name"),
      TaskModel.countDocuments(query)
    );

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
