/** @format */

import { MemberService } from "../services/MemberService.js";
import { ProjectService } from "../services/ProjectService.js";

class ProjectController {
  constructor() {
    this.projectService = new ProjectService();
    this.getMemberRoleInWorkspace =
      new MemberService().getMemberRoleInWorkspace.bind(new MemberService());
  }

  createProject = async (req, res) => {
    const userId = req.user._id;
    const workspaceId = req.params.id;
    const body = req.body;

    try {
      await this.getMemberRoleInWorkspace(userId, workspaceId);

      const { project } = await this.projectService.createProject(
        userId,
        workspaceId,
        body
      );
      res
        .status(200)
        .json({ message: "Project created", status: "ok", project });
    } catch (error) {
      res.status(500).json({ message: error.message, status: "error" });
    }
  };

  getProjectsInWorkspace = async (req, res) => {
    const userId = req.user._id;
    const workspaceId = req.params.id;

    const pageSize = req.query.pageSize;
    const pageNumber = req.query.pageNumber;

    try {
      await this.getMemberRoleInWorkspace(userId, workspaceId);

      const { projects, totalCount, totalPages, skip } =
        await this.projectService.getProjectsInWorkspace(
          workspaceId,
          pageSize,
          pageNumber
        );

      res.status(200).json({
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
      res.status(500).json({ message: error.message, status: "error" });
    }
  };

  getProjectsByIdAndWorkspaceId = async (req, res) => {
    const projectId = req.params.id;
    const workspaceId = req.params.workspaceId;

    const userId = req.user._id;

    try {
      await this.getMemberRoleInWorkspace(userId, workspaceId);

      const { project } =
        await this.projectService.getProjectsByIdAndWorkspaceId(
          workspaceId,
          projectId
        );

      res
        .status(200)
        .json({ message: "Project fetched", status: "ok", project });
    } catch (error) {
      res.status(500).json({ message: error.message, status: "error" });
    }
  };

  getProjectAnalytics = async (req, res) => {
    const projectId = req.params.id;
    const workspaceId = req.params.workspaceId;

    const userId = req.user._id;

    try {
      await this.getMemberRoleInWorkspace(userId, workspaceId);

      const { analytics } = await this.projectService.getProjectAnalytics(
        workspaceId,
        projectId
      );
      res
        .status(200)
        .json({ message: "Analytics retrieved", status: "ok", analytics });
    } catch (error) {
      res.status(500).json({ message: error.message, status: "error" });
    }
  };

  updateProject = async (req, res) => {
    const projectId = req.params.id;
    const workspaceId = req.params.workspaceId;
    const userId = req.user._id;
    const body = req.body;

    try {
      await this.getMemberRoleInWorkspace(userId, workspaceId);

      const { project } = await this.projectService.updateProject(
        workspaceId,
        projectId,
        body
      );
      res
        .status(200)
        .json({ message: "Project updated", status: "ok", project });
    } catch (error) {
      res.status(500).json({ message: error.message, status: "error" });
    }
  };

  deleteProject = async (req, res) => {
    const projectId = req.params.id;
    const workspaceId = req.params.workspaceId;
    const userId = req.user._id;

    try {
      await this.getMemberRoleInWorkspace(userId, workspaceId);

      await this.projectService.deleteProject(workspaceId, projectId);
      res.status(200).json({ message: "Project deleted", status: "ok" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}

export { ProjectController };
