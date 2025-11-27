/** @format */

import express from "express";
import { ProjectController } from "../controllers/project.controller.ts";

import type { Router } from "express";
import type { ProjectControllerInstance } from "../types/controllers/controllers.types.ts";

class ProjectRouter {
  public router: Router;
  public projectController: ProjectControllerInstance;

  constructor() {
    this.router = express.Router();
    this.projectController = new ProjectController();
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get(
      "/:id/workspace/:workspaceId",
      this.projectController.getProjectsByIdAndWorkspaceId
    );
    this.router.get(
      "/:id/workspace/:workspaceId/analytics",
      this.projectController.getProjectAnalytics
    );
    this.router.get(
      "/workspace/:workspaceId/all",
      this.projectController.getProjectsInWorkspace
    );
    this.router.post(
      "/workspace/:workspaceId/create",
      this.projectController.createProject
    );
    this.router.put(
      ":id/workspace/:workspaceId/update",
      this.projectController.updateProject
    );
    this.router.delete(
      "/:id/workspace/:workspaceId/delete",
      this.projectController.deleteProject
    );
  }
}

const projectRouter = new ProjectRouter().router;
export { projectRouter };
