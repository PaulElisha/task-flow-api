/** @format */

import { WorkspaceService } from "../services/workspace.service.ts";
import { MemberService } from "../services/member.service.ts";

import type { Request, Response } from "express";
import type { WorkspaceServiceInstance } from "../types/services/services.types.ts";
import type { MemberServiceInstance } from "../types/services/services.types.ts";
import { handleAsyncControl } from "../middlewares/handleAsyncControl.middleware.ts";
import { roleGuard } from "../utils/roleGuard.ts";
import { Permissions } from "../enums/role.enum.ts";
import { HTTP_STATUS } from "../config/http.config.ts";

class WorkspaceController {
  public workspaceService: WorkspaceServiceInstance;
  public memberService: MemberServiceInstance;

  constructor() {
    this.workspaceService = new WorkspaceService();
    this.memberService = new MemberService();
  }

  createWorkspace = handleAsyncControl(
    async (req: Request, res: Response): Promise<Response> => {
      const userId = req.user?._id;
      const body = req.body;

      try {
        const { role } = await this.memberService.getMemberRoleInWorkspace(
          userId,
          body.workspaceId
        );

        roleGuard().check(role, [Permissions.CREATE_WORKSPACE]);

        const { workspace } = await this.workspaceService.createWorkspace(
          userId,
          body
        );

        return res.status(200).json({
          message: "Workspace created successfully",
          status: "ok",
          workspace,
        });
      } catch (error) {
        throw error;
      }
    }
  );

  getAllWorkspacePerMember = handleAsyncControl(
    async (req: Request, res: Response): Promise<Response> => {
      const userId = req.user?._id;
      try {
        const { workspaces } =
          await this.workspaceService.getAllWorkspacePerMember(userId);

        return res.status(200).json({
          message: "User workspaces fetched successfully",
          status: "ok",
          workspaces,
        });
      } catch (error) {
        throw error;
      }
    }
  );

  getWorkspaceById = handleAsyncControl(
    async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
      const userId = req.user?._id;
      const workspaceId = req.params.id;

      try {
        const { role } = await this.memberService.getMemberRoleInWorkspace(
          userId,
          workspaceId
        );

        roleGuard().check(role, [Permissions.VIEW_ONLY]);

        const { workSpaceAndMembers } =
          await this.workspaceService.getWorkspaceById(workspaceId);

        return res.status(200).json({
          message: "Workspace fetched successfully",
          status: "ok",
          workSpaceAndMembers,
        });
      } catch (error) {
        throw error;
      }
    }
  );

  getWorkspaceAnalytics = handleAsyncControl(
    async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
      const workspaceId = req.params.id;
      const userId = req.user?._id;

      try {
        const { role } = await this.memberService.getMemberRoleInWorkspace(
          userId,
          workspaceId
        );

        roleGuard().check(role, [Permissions.VIEW_ONLY]);

        const analytics = await this.workspaceService.getWorkspaceAnalytics(
          workspaceId
        );

        return res.status(HTTP_STATUS.OK).json({
          message: "Analytics Retrieved",
          status: "ok",
          analytics,
        });
      } catch (error) {
        throw error;
      }
    }
  );

  getWorkspaceMembers = handleAsyncControl(
    async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
      const userId = req.user?._id;
      const workspaceId = req.params.id;

      try {
        const { role } = await this.memberService.getMemberRoleInWorkspace(
          userId,
          workspaceId
        );

        roleGuard().check(role, [Permissions.VIEW_ONLY]);

        const { members, roles } =
          await this.workspaceService.getWorkspaceMembers(workspaceId);

        return res.status(HTTP_STATUS.OK).json({
          message: "Workspace members retrieved",
          status: "ok",
          data: { members, roles },
        });
      } catch (error) {
        throw error;
      }
    }
  );

  changeMemberRole = handleAsyncControl(
    async (
      req: Request<{ id: string }, {}, { memberId: string; roleId: string }>,
      res: Response
    ): Promise<Response> => {
      console.log("Body", req.body);
      const userId = req.user?._id;
      const workspaceId = req.params.id;
      const { memberId, roleId } = req.body;

      try {
        const { role } = await this.memberService.getMemberRoleInWorkspace(
          userId,
          workspaceId
        );

        roleGuard().check(role, [Permissions.CHANGE_MEMBER_ROLE]);

        const { member } = await this.workspaceService.changeMemberRole(
          workspaceId,
          memberId,
          roleId
        );

        return res.status(HTTP_STATUS.OK).json({
          message: "Member role changed",
          status: "ok",
          member,
        });
      } catch (error) {
        throw error;
      }
    }
  );

  updateWorkspaceById = handleAsyncControl(
    async (
      req: Request<{ id: string }, {}, { name: string; description: string }>,
      res: Response
    ): Promise<Response> => {
      const userId = req.user?._id;
      const workspaceId = req.params.id;
      const { name, description } = req.body;

      try {
        const { role } = await this.memberService.getMemberRoleInWorkspace(
          userId,
          workspaceId
        );

        roleGuard().check(role, [Permissions.EDIT_WORKSPACE]);

        const { workspace } = await this.workspaceService.updateWorkspaceById(
          workspaceId,
          name,
          description
        );

        return res.status(HTTP_STATUS.OK).json({
          message: "Workspace updated",
          status: "ok",
          workspace,
        });
      } catch (error) {
        throw error;
      }
    }
  );

  deleteWorkspaceById = handleAsyncControl(
    async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
      const userId = req.user?._id;
      const workspaceId = req.params.id;

      try {
        const { role } = await this.memberService.getMemberRoleInWorkspace(
          userId,
          workspaceId
        );

        roleGuard().check(role, [Permissions.DELETE_WORKSPACE]);

        const workspace = await this.workspaceService.deleteWorkspaceById(
          workspaceId,
          userId
        );

        return res.status(HTTP_STATUS.OK).json({
          message: "Workspace deleted",
          status: "ok",
          workspace,
        });
      } catch (error) {
        throw error;
      }
    }
  );
}

export { WorkspaceController };
