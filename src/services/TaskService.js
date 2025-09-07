import Task from '../models/Task.js';

class TaskService {

    async getTasks(req, res) {
        const { userId } = req.user._id
        const tasks = await Task.find({ userId });
        if (tasks.length == 0) {
            const error = new Error('No Tasks');
            error.status = 404;
            throw error
        }
        return tasks;
    }

    async getTasksByStatus(query, userId) {
        const { status } = query
        let tasks = await Task.find({ userId, status });
        if (tasks.length == 0) {
            const error = new Error('No completed Tasks');
            error.status = 404;
            throw error
        }
        return tasks;
    }

    async getTasksByTags(query) {
        const { tags } = query
        let tasks = await Task.find({ tags: { $in: tags } });
        if (tasks.length == 0) {
            const error = new Error('No Tasks with the specified tags');
            error.status = 404;
            throw error
        }
        return tasks;
    }

    async createTask(taskData) {
        const task = await Task.create(taskData);
        if (!task) {
            const error = new Error("Task creation failed");
            error.status = 400;
            throw error;
        }
        return task;
    }

    async updateTask(filter, taskData) {
        const task = await Task.findOneAndUpdate(filter, taskData, { new: true });
        if (!task) {
            const error = new Error("Task not found or you are not authorized to update this task");
            error.status = 404;
            throw error;
        }
        return task;
    }

    async deleteTask(filter) {
        let task = await Task.findOne(filter);
        if (!task) {
            const error = new Error("Task not found or you are not authorized to delete this task");
            error.status = 404;
            throw error;
        }
        await Task.findByIdAndDelete(id);
        return;
    }
}

export { TaskService }