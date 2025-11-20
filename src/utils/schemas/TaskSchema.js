/** @format */

import Joi from "joi";
import mongoose from "mongoose";
import { Priority, Status } from "../../../models/Task.js";

export const taskIdSchema = Joi.string()
  .custom((value, helpers) => {
    if (mongoose.Types.ObjectId.isValid(value))
      return helpers.error("any.invalid");
    return value;
  }, "ObjectId validation")
  .required();

export const createTaskSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  status: Joi.string()
    .valid(...Object.values(Status))
    .optional(),
  priority: Joi.string()
    .valid(...Object.values(Priority))
    .optional(),
  assignedTo: Joi.string().optional(),
  deadline: Joi.date().greater("now").optional(),
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  status: Joi.string()
    .valid(...Object.values(Status))
    .optional(),
  priority: Joi.string()
    .valid(...Object.values(Priority))
    .optional(),
  assignedTo: Joi.string().optional(),
  deadline: Joi.date().greater("now").optional(),
});
