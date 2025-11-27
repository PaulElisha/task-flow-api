/** @format */

import mongoose, { Document, Schema, model } from "mongoose";

export interface MemberDocument extends Document {
  userId: mongoose.Types.ObjectId;
  workSpaceId: mongoose.Types.ObjectId;
  role: mongoose.Types.ObjectId;
  joinedAt: Date;
}

const memberSchema = new Schema<MemberDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workSpaceId: {
      type: Schema.Types.ObjectId,
      ref: "WorkSpace",
      required: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default model<MemberDocument>("Member", memberSchema);
