/** @format */

import { TaskService } from "../services/task.service.ts";
import { MemberService } from "../services/member.service.ts";
import { Request, Response } from "express";

import {
  TaskServiceInstance,
  MemberServiceInstance,
} from "../types/services/services.types.ts";
import { handleAsyncControl } from "../middlewares/handleAsyncControl.middleware.ts";
import { roleGuard } from "../utils/roleGuard.ts";
import { Permissions } from "../enums/role.enum.ts";

class TaskController {
  public taskService: TaskServiceInstance;
  public memberService: MemberServiceInstance;

  constructor() {
    this.taskService = new TaskService();
    this.memberService = new MemberService();
  }

  createTask = handleAsyncControl(
    async (
      req: Request<{ projectId: string; workspaceId: string }, {}, any, {}>,
      res: Response<{ message: string; status: string; task?: any }>
    ): Promise<Response> => {
      const userId = req.user?._id;
      const body = req.body;
      const projectId = req.params.projectId;
      const workspaceId = req.params.workspaceId;

      try {
        const { role } = await this.memberService.getMemberRoleInWorkspace(
          userId,
          workspaceId
        );

        roleGuard().check(role, [Permissions.CREATE_TASK]);

        const { task } = await this.taskService.createTask(
          workspaceId,
          projectId,
          userId,
          body
        );
        return res
          .status(200)
          .json({ message: "Task created", status: "ok", task });
      } catch (error) {
        throw error;
      }
    }
  );

  updateTask = handleAsyncControl(
    async (
      req: Request<
        { projectId: string; workspaceId: string; id: string },
        {},
        any,
        {}
      >,
      res: Response<{ message: string; status: string; task?: any }>
    ): Promise<Response> => {
      const userId = req.user?._id;
      const taskId = req.params.id;
      const projectId = req.params.projectId;
      const workspaceId = req.params.workspaceId;
      const body = req.body;

      try {
        const { role } = await this.memberService.getMemberRoleInWorkspace(
          userId,
          workspaceId
        );

        roleGuard().check(role, [Permissions.EDIT_TASK]);

        const { task } = await this.taskService.updateTask(
          workspaceId,
          projectId,
          taskId,
          body
        );
        return res
          .status(200)
          .json({ message: "Task updated", status: "ok", task });
      } catch (error) {
        throw error;
      }
    }
  );

  getAllTasks = handleAsyncControl(
    async (
      req: Request<{ workspaceId: string }>,
      res: Response
    ): Promise<Response> => {
      const userId = req.user?._id;
      const workspaceId = req.params.workspaceId;
 
      const filter = {
        projectId: req.query.projectId,
        status: req.query.status ? req.query.status : undefined,
        priority: req.query.priority ? req.query.priority : undefined,
        assignedTo: req.query.assignedTo ? req.query.assignedTo : undefined,
        keyword: req.query.keyword ? req.query.keyword : undefined,
        deadline: req.query.deadline ? req.query.deadline : undefined,
      };

      const pagination = {
        pageSize: parseInt(req.query.pageSize as string),
        pageNumber: parseInt(req.query.pageNumber as string),
      };

      try {
        await this.memberService.getMemberRoleInWorkspace(userId, workspaceId);

        const tasks = await this.taskService.getAllTasks(
          workspaceId,
          filter,
          pagination
        );

        return res
          .status(200)
          .json({ message: "All tasks retrieved", status: "ok", ...tasks });
      } catch (error) {
        throw error;
      }
    }
  );

  getTaskById = handleAsyncControl(
    async (
      req: Request<{ projectId: string; workspaceId: string; id: string }>,
      res: Response
    ): Promise<Response> => {
      const userId = req.user?._id;
      const taskId = req.params.id;
      const workspaceId = req.params.workspaceId;
      const projectId = req.params.projectId;

      try {
        const { role } = await this.memberService.getMemberRoleInWorkspace(
          userId,
          workspaceId
        );

        roleGuard().check(role, [Permissions.VIEW_ONLY]);

        const { task } = await this.taskService.getTaskById(
          workspaceId,
          projectId,
          taskId
        );
        return res
          .status(200)
          .json({ message: "Retrieved Task", status: "ok", task });
      } catch (error) {
        throw error;
      }
    }
  );

  deleteTask = handleAsyncControl(
    async (
      req: Request<{ workspaceId: string; id: string }>,
      res: Response
    ): Promise<Response> => {
      const userId = req.user?._id;
      const taskId = req.params.id;
      const workspaceId = req.params.workspaceId;

      try {
        const { role } = await this.memberService.getMemberRoleInWorkspace(
          userId,
          workspaceId
        );

        roleGuard().check(role, [Permissions.DELETE_TASK]);

        await this.taskService.deleteTask(workspaceId, taskId);

        return res.status(200).json({ message: "Task deleted", status: "ok" });
      } catch (error) {
        throw error;
      }
    }
  );
}

export { TaskController };
