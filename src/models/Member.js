import { Schema, model } from "mongoose";
import joi from "joi";

const memberJoiSchema = joi.object({
    userId: joi.string().required(),
    workSpaceId: joi.string().required(),
    role: joi.string().required(),
    joinedAt: joi.date().optional(),
});

const memberSchema = new Schema(
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

memberJoiSchema.statics.validate = (data) => {
    return memberJoiSchema.validate(data, { abortEarly: false });
};

export default model("Member", memberSchema);
