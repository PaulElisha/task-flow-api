/** @format */
import mongoose, { Document, Schema, model } from "mongoose";

export interface ProjectDocument extends Document {
  workSpaceId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  emoji: string;
  description: string;
  deadline: Date;
}

const projectSchema = new Schema<ProjectDocument>(
  {
    workSpaceId: {
      type: Schema.Types.ObjectId,
      ref: "WorkSpace",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    emoji: {
      type: String,
      default: "🛠️",
    },
    description: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default model<ProjectDocument>("Project", projectSchema);
