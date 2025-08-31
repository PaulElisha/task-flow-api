
import { Schema, model } from "mongoose";

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

export default model("Task", taskSchema);