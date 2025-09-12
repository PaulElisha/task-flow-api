import { Schema, model } from "mongoose";
import joi from 'joi';

const workSpaceJoiSchema = joi.object({
    userId: joi.string().required(),
    name: joi.string().required(),
    description: joi.string().required(),
});

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

workSpaceJoiSchema.statics.validate = (data) => {
    return workSpaceJoiSchema.validate(data, { abortEarly: false });
};

export default model("WorkSpace", workSpaceSchema);
