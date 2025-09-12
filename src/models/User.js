import { Schema, model } from "mongoose";

import bcrypt from "bcrypt";
import joi from 'joi'

const userJoiSchema = joi.object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required(),
    displayPicture: joi.string().optional(),
    isActive: joi.boolean().optional(),
    lastLogin: joi.date.optional(),
    avatar: joi.string().optional()
});

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false,
        },
        displayPicture: {
            type: String,
            default: null,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lastLogin: {
            type: Date,
            default: null,
        },
        avatar: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

userSchema.virtual("workSpaces", {
    ref: "WorkSpace",
    localField: "_id",
    foreignField: "members",
});

userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        if (this.password) this.password = await bcrypt.hash(this.password, 10);
        next();
    }
    next();
});

userSchema.pre("save", async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (password) {
    await bcrypt.compare(password, this.password);
};

userJoiSchema.statics.validate = (data) => {
    return userJoiSchema.validate(data, { abortEarly: false });
};

export default model("User", userSchema);
