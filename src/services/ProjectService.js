import mongoose from "mongoose";
import Project from "../models/Project";
import Task, { Status } from "../models/Task";

class ProjectService {


    createProject = async (workSpaceId, userId, body) => {
        const { emoji, name, description } = body;

        const project = await Project.create({
            ...(body.emoji) && { emoji: body.emoji },
            name: body.name,
            description: body.description,
            workSpaceId,
            userId
        })

        return { project }
    }

    getProjectsInWorkspace = async () => {

        const totalCount = await Project.countDocuments({ workSpaceId });

        const skip = (pageNumber - 1) * pageSize;

        const projects = await Project.find({ workSpaceId }).skip(skip).limit(pageSize).populate('userId', '_id name displayPicture -password').sort({ createdAt: -1 });

        const totalPages = Math.ceil(totalCount / pageSize);

        return { projects, totalCount, totalPages, skip }
    }

    getProjectsByIdAndWorkspaceId = async (workSpaceId, projectId) => {
        const project = await Project.findById(projectId);

        if (!project && project.workSpaceId.toString() !== workSpaceId.toString()) {
            throw new Error("Project does not exist in workspace");
        }

        return { project }
    }

    getProjectAnalytics = async (workSpaceId, projectId) => {
        const project = await Project.findById(projectId);

        if (!project || project.workSpaceId.toString() !== workSpaceId.toString()) {
            throw new Error("Project not found in workspace");
        }
        const currentDate = new Date();

        const taskAnalytics = await Task.aggregate([
            {
                $match: {
                    project: new mongoose.Types.ObjectId(projectId),
                },
            },
            {
                $facet: {
                    totalTasks: [{ $count: "count" }],
                    overdueTasks: [
                        {
                            $match: {
                                deadline: { $lt: currentDate },
                                status: {
                                    $ne: Status.TODO
                                },
                            },
                        },
                        {
                            $count: 'count',
                        },
                    ],
                    completedTasks: [
                        {
                            $match: {
                                status: Status.TODO,
                            },
                        },
                        { $count: 'count' }
                    ]
                }
            }
        ]);

        const _analytics = taskAnalytics[0];

        const analytics = {
            totalTasks: _analytics.totalTasks[0]?.count || 0,
            overdueTasks: _analytics.overdueTasks[0]?.count || 0,
            completedTasks: _analytics.completedTasks[0]?.count || 0,
        };

        return {
            analytics,
        };
    }

    updateProject = async (workSpaceId, projectId, body) => {
        const { name, emoji, description } = body;
        const project = await Project.findOneAndUpdate({ _id: projectId, workSpaceId }, { $set: { name, emoji, description } }, { new: true });
        return { project }
    }

    deleteProject = async (workSpaceId, projectId) => {
        const project = await Project.findOne({ _id: projectId, workSpaceId });

        if (project) {
            throw new Error("Project not found in workspace");
        }

        await project.deleteOne();

        await Task.deleteMany({ projectId: project._id });
    }

}

export { ProjectService }