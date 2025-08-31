import Task from '../models/Task.js';

class TaskService {

    async getTasks(query) {
        const { status, userId } = query
        let tasks = await Task.find({ userId });
        if (tasks.length == 0) {
            const error = new Error('No completed Tasks');
            error.status = 404;
            throw error
        }

        switch (status) {
            case "active":
                tasks = tasks.filter((task) => task.status === "active");
                break;
            case "in-progress":
                tasks = tasks.filter((task) => task.status === "in-progress");
                break;
            case "completed":
                tasks = tasks.filter((task) => task.status === "completed");
                break;
            case "uncompleted":
                tasks = tasks.filter((task) => task.status !== "uncompleted");
            default:
                break;
        }
        return tasks;
    }

    async createTask(taskData) {
        let task = await Task.findOne({ title: taskData.title });
        if (task) {
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

    async updateTask(filter, taskData) {
        let task = await Task.findOne(filter);
        if (!task) {
            const error = new Error("Task not found");
            error.status = 404;
            throw error;
        }
        task = await Task.updateOne(id, taskData, { new: true });
        return task;
    }

    async deleteTask(filter) {
        let task = await Task.findById(filter);
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