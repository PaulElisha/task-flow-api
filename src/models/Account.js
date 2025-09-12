import joi from 'joi';
import { Schema, model } from "mongoose";

const accountJoiSchema = joi.object({
    userId: joi.object().ref().required(),
    provider: joi.string.required(),
    providerId: joi.string().required(),
    refreshToken: joi.string().optional(),
    tokenExpiry: joi.date().optional()
})

const accountSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        provider: {
            type: String,
            enum: ["google", "github", "facebook"],
            default: "google",
        },
        providerId: {
            type: String,
            required: true,
            unique: true,
        },
        refreshToken: {
            type: String,
            default: null,
        },
        tokenExpiry: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                delete ret.refreshToken;
            },
        },
    }
);

accountJoiSchema.statics.validate = (data) => {
    return accountJoiSchema.validate(data, { abortEarly: false });
};

export default model("Account", accountSchema);
