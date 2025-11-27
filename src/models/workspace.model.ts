/** @format */

import mongoose, { Document, Schema, model } from "mongoose";

export interface WorkspaceDocument extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  inviteCode: string;
  resetInviteCode: () => void;
}

const workSpaceSchema = new Schema<WorkspaceDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    inviteCode: {
      type: String,
      unique: true,
      default: () => Math.random().toString(36).substring(2, 8),
    },
  },
  { timestamps: true }
);

workSpaceSchema.methods.resetInviteCode = function () {
  this.inviteCode = Math.random().toString(36).substring(2, 8);
};

export default model<WorkspaceDocument>("WorkSpace", workSpaceSchema);
