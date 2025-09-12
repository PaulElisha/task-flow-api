import Task from "../models/Task.js";
import Project from "../models/Project.js";
import Member from "../models/Member.js";

class TaskService {
    createTask = async (workSpaceId, userId, projectId, body) => {
        const { title, description, priority, status, assignedTo, deadline } = body;

        const project = await Project.findById(projectId);

        if (!project || project.workSpaceId.toString() !== workSpaceId.toString())
            throw new Error("Project not found or does not belong to this workspace");

        if (assignedTo) {
            const isAssignedTo = await Member.exists({
                userId: assignedTo,
                workSpaceId,
            });

            if (!isAssignedTo)
                throw new Error("Assigned user is not a member of this workspace");
        }

        const task = Task.create({
            title,
            description,
            priority: priority,
            status: status,
            userId,
            workSpaceId,
            projectId,
            deadline,
        });

        return { task };
    };

    getTaskById = async (workSpaceId, projectId, taskId) => {
        const project = Project.findById(projectId);

        if (!project || project.workSpaceId.toString() !== workSpaceId.toString())
            throw new Error("Project does not exists in this workspace");

        const task = Task.findOne({ _id: taskId, workSpaceId, projectId }).populate(
            "assignedTo",
            "_id name displayPicture -permissions"
        );

        if (!task) throw new Error("Task not found");

        return { task };
    };

    deleteTask = async (workSpaceId, taskId) => {
        return await Task.findOneAndDelete({ _id: taskId, workSpaceId });
    };

    updateTask = async (workSpaceId, projectId, taskId, body) => {
        const { title, description, priority, status, assignedTo, deadline } = body;

        const project = await Project.findById(projectId);

        if (!project || project.workSpaceId.toString() !== workSpaceId.toString())
            throw new Error("Project does not exists in this workspace");

        let task = await Task.findById(taskId);

        if (!task || task.projectId.toString() !== projectId.toString())
            throw new Error("Task does not belong to this project");

        task = await Task.findByIdAndUpdate(
            { taskId },
            { $set: { ...body } },
            { new: true }
        );

        if (!task) throw new Error("Failed to update task");

        return { task };
    };

    getAllTasks = async (workSpaceId, filters, pagination) => {
        const query = {
            workSpaceId
        }

        if (filters.projectId) {
            query.projectId = projectId
        }

        if (filters.status && filters.status.length > 0) {
            query.status = { $in: filters.status }
        }

        if (filters.priority && filters.priority.length > 0) {
            query.priority = { $in: filters.priority }
        }

        if (filters.assignedTo && filters.assignedTo.length > 0) {
            query.assignedTo = { $in: filters.assignedTo }
        }

        if (filters.keyword && filters.keyword !== undefined) {
            query.title = { $regex: filters.keyword, $options: "i" }
        }

        if (filters.deadline) {
            query.deadline = {
                $eq: new Date(filters.deadline)
            }
        }

        const { pageSize, pageNumber } = pagination;

        const skip = (pageNumber - 1) * pageSize

        const [tasks, totalCount] = await Promise.all(
            TaskModel.find(query)
                .skip(skip)
                .limit(pageSize)
                .sort({ createdAt: -1 })
                .populate("assignedTo", "_id name displayPicture -password")
                .populate("project", "_id emoji name"),
            TaskModel.countDocuments(query),
        )

        const totalPages = Math.ceil(totalCount / pageSize);

        return {
            tasks,
            pagination: {
                pageSize,
                pageNumber,
                totalCount,
                totalPages,
                skip,
            },
        };
    }
}

export { TaskService };
