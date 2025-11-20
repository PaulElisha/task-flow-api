/** @format */

import Joi from "joi";
import mongoose from "mongoose";

export const projectIdSchema = Joi.string()
  .custom((value, helpers) => {
    if (mongoose.Types.ObjectId.isValid(value))
      return helpers.error("any.invalid");
    return value;
  }, "ObjectId validation")
  .required();

export const createProjectSchema = Joi.object({
  name: Joi.string().trim().required(),
  emoji: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  deadline: Joi.date().greater("now").optional(),
});

export const updateProjectSchema = Joi.object({
  name: Joi.string().trim().required(),
  emoji: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  deadline: Joi.date().greater("now").optional(),
});
