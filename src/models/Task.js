import { Schema, model } from "mongoose";
import joi from 'joi';

const taskJoiSchema = joi.object({
    userId: joi.string().required(),
    description: joi.string().required(),
    location: joi.string().required(),
    salary: joi.string().optional(),
    company: joi.string().optional(),
    role: joi.string().valid('Full-time', 'Part-time', 'Contract', 'Internship').required(),
    mode: joi.string().valid('On-site', 'Remote', 'Hybrid').required(),
    experience: joi.string().required(),
    industry: joi.string().required(),
    expiryData: joi.date().required(),
    website: joi.string().required()
});

const taskSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["active", "in-progress", "completed", "uncompleted"],
        required: true,
        default: ""
    },
    tags: {
        type: Array,
    },
    deadline: {
        type: Date
    }
}, { timestamps: true });

taskJoiSchema.statics.validateTask = (taskData) => {
    return taskJoiSchema.validate(taskData, { abortEarly: false });
}

export default model("Task", taskSchema);