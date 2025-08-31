import { TaskService } from "../services/TaskService.js";

class TaskController {
    constructor() {
        this.taskService = new TaskService();
    }

    async getTasks(req, res) {
        try {
            const tasks = await this.taskService.getTasks();
            res.status(200).json({ status: "ok", message: "Task fetched successfully", data: tasks });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createTask(req, res) {
        try {
            const task = await this.taskService.createTask(req.body);
            res.status(201).json({ status: "ok", message: "Task created successfully", data: task });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateTask(req, res) {
        try {
            await this.taskService.updateTask(req.params.id, req.body);
            res.status(200).json({ status: "ok", message: "Task updated successfully" });
        } catch (error) {
            res.status(500).json(error.message);
        }
    }

    async deleteTask(req, res) {
        try {
            await this.taskService.deleteTask(req.params.id);
            res.status(200).json({ status: "ok", message: "Task deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export { TaskController }