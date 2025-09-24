/** @format */

import { Schema, model } from "mongoose";

const workSpaceSchema = new Schema(
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

export default model("WorkSpace", workSpaceSchema);
