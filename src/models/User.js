/** @format */

import { Schema, model } from "mongoose";

import bcrypt from "bcrypt";
import joi from "joi";

const userJoiSchema = joi.object({
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  email: joi.string().required(),
  password: joi.string().required(),
  displayPicture: joi.string().optional(),
  isActive: joi.boolean().optional(),
  lastLogin: joi.date.optional(),
  avatar: joi.string().optional(),
});

const userSchema = new Schema(
  {
    name: {
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
      select: true,
    },
    currentWorkspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
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
  },
  { timestamps: true }
);

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
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.omitPassword = async () => {
  const userObject = this.toObject();
  delete userObject.password;

  return userObject;
};
export default model("User", userSchema);
