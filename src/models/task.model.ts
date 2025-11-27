/** @format */

import mongoose, { Document, Schema, model } from "mongoose";
import {
  PriorityType,
  StatusType,
  Status,
  Priority,
} from "../enums/task-status.enum.ts";

export interface TaskDocument extends Document {
  userId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  workSpaceId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  status: StatusType;
  priority: PriorityType;
  assignedTo: mongoose.Types.ObjectId;
  taskCode: string;
  deadline: Date;
}

const taskSchema = new Schema<TaskDocument>(
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

export default model<TaskDocument>("Task", taskSchema);
