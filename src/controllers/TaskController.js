import { TaskService } from "../services/TaskService.js";

class TaskController {
    constructor() {
        this.taskService = new TaskService();
    }

    async getTasks(req, res) {
        const query = {};

        const { status } = req.query;
        const { userId } = req.user._id

        if (status) {
            query.status = status
        }

        if (userId) {
            query.userId = userId
        }
        try {
            const data = await this.taskService.getTasks(query);
            res.status(200).json({ message: "Completed tasks fetched successfully", status: "   ok", data });
        } catch (error) {
            console.error("Error fetching completed tasks:", error);
            res.status(500).json({ message: error.message, status: "error" });
        }
    }

    async createTask(req, res) {
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
            await this.taskService.deleteTask(req.params.id);
            res.status(200).json({ status: "ok", message: "Task deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message, status: "error" });
        }
    }
}

export { TaskController }