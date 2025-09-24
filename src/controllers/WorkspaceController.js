/** @format */

import { WorkspaceService } from "../services/WorkspaceService";
import { MemberService } from "../services/MemberService";

class WorkspaceController {
  constructor() {
    this.workspaceService = new WorkspaceService();
    this.getMemberRoleInWorkspace =
      new MemberService().getMemberRoleInWorkspace.bind(new MemberService());
  }

  createWorkspace = async (req, res) => {
    const userId = req.user._id;
    const body = req.body;

    try {
      const { workspace } = await this.workspaceService.createWorkspace(
        userId,
        body
      );
      res.status(200).json({
        message: "Workspace created successfully",
        status: "ok",
        workspace,
      });
    } catch (error) {
      res.status(500).json({ message: error.message, status: "error" });
    }
  };

  getAllWorkspacePerMember = async (req, res) => {
    try {
      const { workspace } =
        await this.workspaceService.getAllWorkspacePerMember(req.user._id);
      res.status(200).json({
        message: "User workspaces fetched successfully",
        status: "ok",
        workspace,
      });
    } catch (error) {
      res.status(500).json({ message: error.message, status: "error" });
    }
  };

  getWorkspaceById = async (req, res) => {
    const userId = req.user._id;
    const workspaceId = req.params.id;

    try {
      await this.getMemberRoleInWorkspace(userId, workspaceId);
      const { workspace } = await this.workspaceService.getWorkspaceById(
        workspaceId
      );
      res.status(200).josn({
        message: "Workspace fetched successfully",
        status: "ok",
        workspace,
      });
    } catch (error) {
      res.status(500).json({ message: error.message, status: "error" });
    }
  };

  getWorkspaceAnalytics = async (req, res) => {
    const workspaceId = req.params.id;
    const userId = req.user._id;

    try {
      await this.getMemberRoleInWorkspace(userId, workspaceId);

      const { analytics } = await this.workspaceService.getWorkspaceAnalytics(
        workspaceId
      );
      res.status(200).json({
        message: "Analytics Retrieved",
        status: "ok",
        analytics,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        status: "error",
      });
    }
  };

  getWorkspaceMembers = async (req, res) => {
    const userId = req.user._id;
    const workspaceId = req.params.id;

    try {
      await this.getMemberRoleInWorkspace(userId, workspaceId);
      const { members, roles } =
        await this.workspaceService.getWorkspaceMembers(workspaceId);
      res.status(200).json({
        message: "Workspace members retrieved",
        status: "ok",
        data: { members, roles },
      });
    } catch (error) {
      res.status(500).json({ message: error.message, status: "error" });
    }
  };

  changeMemberRole = async (req, res) => {
    const userId = req.user._id;
    const workspaceId = req.params.id;
    const { memberId, roleId } = req.body;

    try {
      await this.getMemberRoleInWorkspace(userId, workspaceId);
      const { member } = await this.workspaceService.changeMemberRole(
        workspaceId,
        memberId,
        roleId
      );
      res
        .status(200)
        .json({ message: "Member role changed", status: "ok", member });
    } catch (error) {
      res.status(500).json({ message: error.message, status: "error" });
    }
  };

  updateWorkspaceById = async (req, res) => {
    const userId = req.user._id;
    const workspaceId = req.params.id;
    const { name, description } = req.body;

    try {
      await this.getMemberRoleInWorkspace(userId, workspaceId);
      const { workspace } = await this.workspaceService.updateWorkspaceById(
        workspaceId,
        name,
        description
      );
      res
        .status(200)
        .json({ message: "Workspace updated", status: "ok", workspace });
    } catch (error) {
      res.status(500).json({ message: error.message, status: "error" });
    }
  };

  deleteWorkspaceById = async (req, res) => {
    const userId = req.user._id;
    const workspaceId = req.params.id;

    try {
      await this.getMemberRoleInWorkspace(userId, workspaceId);
      await this.workspaceService.deleteWorkspaceById(workspaceId, userId);
      res.status(200).json({ message: "Workspace deleted", status: "ok" });
    } catch (error) {
      res.status(500).json({ message: error.message, status: "error" });
    }
  };
}

export { WorkspaceController };
