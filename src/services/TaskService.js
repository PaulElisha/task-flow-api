import Task from '../models/Task.js';

class TaskService {
    async getTasks() {
        const tasks = await Task.find();
        if (tasks.length === 0) {
            const error = new Error("No tasks found");
            error.status = 404;
            throw error;
        }
        return tasks;
    }

    async createTask(taskData) {
        let task = await Task.findOne({ title: taskData.title });
        if (foundTask) {
            const error = new Error("Task with this title already exists");
            error.status = 400;
            throw error;
        }

        task = await Task.create(taskData);
        if (!task) {
            const error = new Error("Task creation failed");
            error.status = 400;
            throw error;
        }
        return task;
    }

    async updateTask(id, taskData) {
        let task = await Task.findById(id);
        if (!foundTask) {
            const error = new Error("Task not found");
            error.status = 404;
            throw error;
        }
        task = await Task.updateOne(id, taskData, { new: true });
        return task;
    }

    async deleteTask(id) {
        let task = await Task.findById(id);
        if (!task) {
            const error = new Error("Task not found");
            error.status = 404;
            throw error;
        }
        await Task.findByIdAndDelete(id);
        return;
    }
}

export { TaskService }