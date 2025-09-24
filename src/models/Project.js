/** @format */
import { Schema, model } from "mongoose";

const projectSchema = new Schema(
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

export default model("Project", projectSchema);
