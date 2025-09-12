import { Task } from "../models/Task.js";
import { TaskService } from "../services/TaskService.js";
import { MemberService } from '../services/MemberService'

class TaskController {
    constructor() {
        this.taskService = new TaskService();
        this.getMemberRoleInWorkspace = new MemberService().getMemberRoleInWorkspace.bind(new MemberService());
    }

    createTask = async (req, res) => {
        const userId = req.user._id;
        const body = req.body;
        const projectId = req.params.projectId;
        const workspaceId = req.params.workspaceId;

        try {
            await this.getMemberRoleInWorkspace(userId, workspaceId);

            const { task } = await this.taskService.createTask(workspaceId, projectId, userId, body);
            res.status(200).json({ message: 'Task created', status: 'ok', task });
        } catch (error) {
            res.status(500).json({ message: error.message, status: 'error' })
        }
    }

    updateTask = async (req, res) => {
        const userId = req.user._id;
        const taskId = req.params.id;
        const projectId = req.params.projectId;
        const workspaceId = req.params.workspaceId;
        const body = req.body;

        try {
            await this.getMemberRoleInWorkspace(userId, workspaceId)

            const { task } = await this.taskService.updateTask(workspaceId, projectId, taskId, body);
            res.status(200).json({ message: 'Task updated', status: 'ok', task });
        } catch (error) {
            res.status(500).json({ message: error.message, status: 'error' })
        }
    }

    getAllTasks = async (req, res) => {
        const userId = req.user._id;
        const workSpaceId = req.params.workSpaceId;

        const filter = {
            projectId: req.query.projectId,
            status: req.query.status ? req.query.status : undefined,
            priority: req.query.priority ? req.query.priority : undefined,
            assignedTo: req.query.assignedTo ? req.query.assignedTo : undefined,
            keyword: req.query.keyword ? req.query.keyword : undefined,
            deadline: req.query.deadline ? req.query.deadline : undefined
        }

        const pagination = {
            pageSize: req.query.pageSize,
            pageNumber: req.query.pageNumber
        }

        try {
            await this.getMemberRoleInWorkspace(userId, workSpaceId);

            const tasks = await this.taskService.getAllTasks(workSpaceId, filter, pagination);
            res.status(200).json({ message: 'All tasks retrieved', status: 'ok', ...tasks })
        } catch (error) {
            res.status(500).json({ message: error.message, status: 'error' })
        }
    }

    getTaskById = async (req, res) => {
        const userId = req.user._id;
        const taskId = req.params.id;
        const workspaceId = req.params.workspaceId;
        const projectId = req.params.projectId;

        try {
            await this.getMemberRoleInWorkspace(userId, workspaceId);

            const { task } = await this.taskService.getTaskById(workspaceId, projectId, taskId);
            res.status(200).json({ message: 'Retrieved Task', status: 'ok', task })
        } catch (error) {
            res.status(500).json({ message: error.message, status: 'error' })
        }
    }

    deleteTask = async (req, res) => {
        const userId = req.user._id;
        const taskId = req.taskId;
        const workspaceId = req.params.workspaceId;

        try {
            await this.getMemberRoleInWorkspace(userId, workspaceId);

            await this.taskService.deleteTask(workspaceId, taskId);

            res.status(200).json({ message: 'Task deleted', status: 'ok' })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export { TaskController }