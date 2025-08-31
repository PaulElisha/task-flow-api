import express from 'express';
import { TaskController } from '../controllers/TaskController.js';

class TaskRouter {
    constructor() {
        this.router = express.Router();
        this.userAccess = new UserAuthorization();
        this.taskController = new TaskController();
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get("/", this.taskController.getTasks);
        this.router.post("/", this.taskController.createTask);
        this.router.put("/:id", this.taskController.updateTask);
        this.router.delete("/:id", this.taskController.deleteTask);
    }
}

const taskRouter = new TaskRouter().router;
export { taskRouter }