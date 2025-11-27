import Joi from "joi";
import mongoose from "mongoose";

export const workspaceIdSchema = Joi.string()
  .custom((value, helpers) => {
    if (mongoose.Types.ObjectId.isValid(value))
      return helpers.error("any.invalid");
    return value;
  }, "ObjectId validation")
  .required();

export const createWorkspaceSchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
});

export const updateWorkspaceSchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
});