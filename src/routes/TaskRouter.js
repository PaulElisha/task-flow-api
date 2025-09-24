/** @format */

import express from "express";
import { TaskController } from "../controllers/TaskController.js";

class TaskRouter {
  constructor() {
    this.router = express.Router();
    this.userAccess = new UserAuthorization();
    this.taskController = new TaskController();
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get(
      "/workspace/:workspaceId/all",
      this.taskController.getAllTasks
    );
    this.router.get(
      "/:id/project/:projectId/workspace/:workspaceId",
      this.taskController.getTaskById
    );
    this.router.post(
      "/project/:projectId/workspace/:workspaceId/create",
      this.taskController.createTask
    );
    this.router.put(
      "/:id/project/:projectId/workspace/:workspaceId/update",
      this.taskController.updateTask
    );
    this.router.delete("/:id", this.taskController.deleteTask);
  }
}

const taskRouter = new TaskRouter().router;
export { taskRouter };
