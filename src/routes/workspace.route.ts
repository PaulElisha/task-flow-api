/** @format */

import express from "express";
import { WorkspaceController } from "../controllers/workspace.controller.ts";

import type { Router } from "express";
import type { WorkspaceControllerInstance } from "../types/controllers/controllers.types.ts";

class WorkspaceRouter {
  public router: Router;
  public workspaceController: WorkspaceControllerInstance;

  constructor() {
    this.router = express.Router();
    this.workspaceController = new WorkspaceController();
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get("/:id", this.workspaceController.getWorkspaceById);
    this.router.get(
      "analytics/:id",
      this.workspaceController.getWorkspaceAnalytics
    );
    this.router.get(
      "/members/:id",
      this.workspaceController.getWorkspaceMembers
    );
    this.router.get("/all", this.workspaceController.getAllWorkspacePerMember);
    this.router.post("/create/new", this.workspaceController.createWorkspace);
    this.router.put(
      "/update/:id",
      this.workspaceController.updateWorkspaceById
    );
    this.router.put(
      "/change/member/role/:id",
      this.workspaceController.changeMemberRole
    );
    this.router.delete(
      "/delete/:id",
      this.workspaceController.deleteWorkspaceById
    );
  }
}

const workspaceRouter = new WorkspaceRouter().router;
export { workspaceRouter };
