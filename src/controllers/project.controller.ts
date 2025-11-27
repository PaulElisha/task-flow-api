/** @format */

import { handleAsyncControl } from "../middlewares/handleAsyncControl.middleware.ts";
import { MemberService } from "../services/member.service.ts";
import { ProjectService } from "../services/project.service.ts";

import { Request, Response } from "express";
import { roleGuard } from "../utils/roleGuard.ts";
import { Permissions } from "../enums/role.enum.ts";

class ProjectController {
  public projectService: ProjectService;
  public memberService: MemberService;

  constructor() {
    this.projectService = new ProjectService();
    this.memberService = new MemberService();
  }

  createProject = handleAsyncControl(
    async (
      req: Request<{ workspaceId: string }>,
      res: Response
    ): Promise<Response> => {
      const userId = req.user?._id;
      const workspaceId = req.params.workspaceId;
      const body = req.body;

      try {
        const { role } = await this.memberService.getMemberRoleInWorkspace(
          userId,
          workspaceId
        );

        roleGuard().check(role, [Permissions.CREATE_PROJECT]);

        const { project } = await this.projectService.createProject(
          userId,
          workspaceId,
          body
        );
        return res
          .status(200)
          .json({ message: "Project created", status: "ok", project });
      } catch (error) {
        throw error;
      }
    }
  );

  getProjectsInWorkspace = handleAsyncControl(
    async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
      const userId = req.user?._id;
      const workspaceId = req.params.id;

      const pageSize = parseInt(req?.query?.pageSize as string);
      const pageNumber = parseInt(req?.query?.pageNumber as string);

      try {
        const { role } = await this.memberService.getMemberRoleInWorkspace(
          userId,
          workspaceId
        );

        roleGuard().check(role, [Permissions.VIEW_ONLY]);

        const { projects, totalCount, totalPages, skip } =
          await this.projectService.getProjectsInWorkspace(
            workspaceId,
            pageSize,
            pageNumber
          );

        return res.status(200).json({
          message: "Projects fetched",
          status: "ok",
          data: {
            projects,
            pagination: {
              totalCount,
              pageSize,
              pageNumber,
              totalPages,
              skip,
              limit: pageSize,
            },
          },
        });
      } catch (error) {
        throw error;
      }
    }
  );

  getProjectsByIdAndWorkspaceId = handleAsyncControl(
    async (
      req: Request<{ id: string; workspaceId: string }>,
      res: Response
    ): Promise<Response> => {
      const projectId = req.params.id;
      const workspaceId = req.params.workspaceId;

      const userId = req.user?._id;

      try {
        const { role } = await this.memberService.getMemberRoleInWorkspace(
          userId,
          workspaceId
        );

        roleGuard().check(role, [Permissions.VIEW_ONLY]);

        const { project } =
          await this.projectService.getProjectsByIdAndWorkspaceId(
            workspaceId,
            projectId
          );

        return res
          .status(200)
          .json({ message: "Project fetched", status: "ok", project });
      } catch (error) {
        throw error;
      }
    }
  );

  getProjectAnalytics = handleAsyncControl(
    async (
      req: Request<{ id: string; workspaceId: string }>,
      res: Response
    ): Promise<Response> => {
      const projectId = req.params.id;
      const workspaceId = req.params.workspaceId;

      const userId = req.user?._id;

      try {
        const { role } = await this.memberService.getMemberRoleInWorkspace(
          userId,
          workspaceId
        );

        roleGuard().check(role, [Permissions.VIEW_ONLY]);

        const { analytics } = await this.projectService.getProjectAnalytics(
          workspaceId,
          projectId
        );
        return res
          .status(200)
          .json({ message: "Analytics retrieved", status: "ok", analytics });
      } catch (error) {
        throw error;
      }
    }
  );

  updateProject = handleAsyncControl(
    async (
      req: Request<{ id: string; workspaceId: string }>,
      res: Response
    ): Promise<Response> => {
      const projectId = req.params.id;
      const workspaceId = req.params.workspaceId;
      const userId = req.user?._id;
      const body = req.body;

      try {
        const { role } = await this.memberService.getMemberRoleInWorkspace(
          userId,
          workspaceId
        );

        roleGuard().check(role, [Permissions.EDIT_PROJECT]);

        const { project } = await this.projectService.updateProject(
          workspaceId,
          projectId,
          body
        );
        return res
          .status(200)
          .json({ message: "Project updated", status: "ok", project });
      } catch (error) {
        throw error;
      }
    }
  );

  deleteProject = handleAsyncControl(
    async (
      req: Request<{ id: string; workspaceId: string }>,
      res: Response
    ): Promise<Response> => {
      const projectId = req.params.id;
      const workspaceId = req.params.workspaceId;
      const userId = req.user?._id;

      try {
        const { role } = await this.memberService.getMemberRoleInWorkspace(
          userId,
          workspaceId
        );

        roleGuard().check(role, [Permissions.DELETE_PROJECT]);

        await this.projectService.deleteProject(workspaceId, projectId);
        return res
          .status(200)
          .json({ message: "Project deleted successfully", status: "ok" });
      } catch (error) {
        throw error;
      }
    }
  );
}

export { ProjectController };
