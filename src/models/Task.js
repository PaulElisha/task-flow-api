/** @format */

import { Schema, model } from "mongoose";

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
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "Member",
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

export default model("Task", taskSchema);
