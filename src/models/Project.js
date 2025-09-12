import joi from 'joi';
import { Schema, model } from "mongoose";

const memberJoiSchema = joi.object({
    userId: joi.string().required(),
    workSpaceId: joi.string().required(),
    role: joi.string().required(),
    joinedAt: joi.date().optional(),
});

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

memberJoiSchema.statics.validate = (data) => {
    return memberJoiSchema.validate(data, { abortEarly: false });
};

export default model("Project", projectSchema);
