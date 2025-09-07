import { Task } from "../models/Task.js";
import { TaskService } from "../services/TaskService.js";

class TaskController {
    constructor() {
        this.taskService = new TaskService();
    }

    async getTasks(req, res) {
        const { userId } = req.user._id

        try {
            const data = await this.taskService.getTasks(userId);
            res.status(200).json({ message: "Completed tasks fetched successfully", status: "   ok", data });
        } catch (error) {
            console.error("Error fetching completed tasks:", error);
            res.status(500).json({ message: error.message, status: "error" });
        }
    }

    async getTasksByStatus(req, res) {
        const query = {};

        const { status } = req.query;
        const { userId } = req.user._id

        if (status) {
            query.status = status
        }
        try {
            const data = await this.taskService.getTasksByStatus(query, userId);
            res.status(200).json({ message: "Completed tasks fetched successfully", status: "   ok", data });
        } catch (error) {
            console.error("Error fetching completed tasks:", error);
            res.status(500).json({ message: error.message, status: "error" });
        }
    }

    async getTasksByTags(req, res) {
        try {
            const data = await this.taskService.getTasksByTags(req.query);
            res.status(200).json({ message: "Tasks with specified tags fetched successfully", status: "ok", data });
        } catch (error) {
            res.status(500).json({ message: error.message, status: "error" });
        }
    }

    async createTask(req, res) {
        const { error } = Task.validateBlog(req.body);
        if (error) {
            return res.status(400).json({
                status: "error",
                error: error.details[0].message,
            });
        }

        try {
            const task = await this.taskService.createTask(req.body);
            res.status(201).json({ status: "ok", message: "Task created successfully", data: task });
        } catch (error) {
            res.status(500).json({ error: error.message, status: "error" });
        }
    }

    async updateTask(req, res) {
        const updateData = req.body;
        const taskId = req.params.id;
        const userId = req.user._id;
        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'No data provided for update' });
        }

        const filter = { _id: taskId, userId };
        try {
            await this.taskService.updateTask(filter, updateData);
            res.status(200).json({ status: "ok", message: "Task updated successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message, status: "error" });
        }
    }

    async deleteTask(req, res) {

        const taskId = req.params.id;
        const userId = req.user._id;
        const filter = { _id: taskId, userId };

        try {
            await this.taskService.deleteTask(filter);
            res.status(200).json({ status: "ok", message: "Task deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message, status: "error" });
        }
    }
}

export { TaskController }