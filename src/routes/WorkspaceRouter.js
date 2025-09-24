/** @format */

import express from "express";
import { WorkspaceController } from "../controllers/WorkspaceController.js";

class WorkspaceRouter {
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
