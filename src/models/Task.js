import { Schema, model } from "mongoose";
import joi from "joi";

const taskJoiSchema = joi.object({
    userId: joi.string().required(),
    projectId: joi.string().required(),
    workSpaceId: joi.string().required(),
    assignedTo: joi.string().optional(),
    title: joi.string().required(),
    description: joi.string().required(),
    status: joi
        .string()
        .valid("BACKLOG", "TODO", "IN_PROGRESS", "IN_REVIEW", "DONE")
        .optional(),
    priority: joi.string().valid("LOW", "MEDIUM", "HIGH").optional(),
    deadline: joi.date().optional(),
});

export const Status = {
    BACKLOG: "BACKLOG",
    TODO: "TODO",
    IN_PROGRESS: "IN_PROGRESS",
    IN_REVIEW: "IN_REVIEW",
    DONE: "DONE",
};

export const Priority = {
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    HIGH: "HIGH",
};

const taskSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        projectId: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        workSpaceId: {
            type: Schema.Types.ObjectId,
            ref: "WorkSpace",
            required: true,
        },
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: "Member",
        },
        title: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(Status),
            default: Status.TODO,
        },
        priority: {
            type: String,
            enum: Object.values(Priority),
            default: Priority.MEDIUM,
        },
        taskCode: {
            type: String,
            unique: true,
            default: () => Math.random().toString(36).substring(2, 8),
        },
        deadline: {
            type: Date,
        },
    },
    { timestamps: true }
);

taskJoiSchema.statics.validate = (data) => {
    return taskJoiSchema.validate(data, { abortEarly: false });
};

export default model("Task", taskSchema);
