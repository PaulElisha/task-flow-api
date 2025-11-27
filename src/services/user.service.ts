/** @format */

import User from "../models/user.model.ts";
import Account from "../models/account.model.ts";
import Member from "../models/member.model.ts";
import Workspace from "../models/workspace.model.ts";
import { NotFoundExceptionError } from "../errors/not-found-exception.error.ts";
import { HTTP_STATUS } from "../config/http.config.ts";
import { ErrorCode } from "../enums/error-code.enum.ts";
import mongoose from "mongoose";
import { UnauthorizedExceptionError } from "../errors/unauthorized-exception.error.ts";

class UserService {
  getCurrentUser = async (userId: mongoose.Types.ObjectId) => {
    const user = await User.findById(userId)
      .populate("currentWorkspace")
      .select("-password");

    if (!user)
      throw new UnauthorizedExceptionError(
        "User not found",
        HTTP_STATUS.NOT_FOUND,
        ErrorCode.RESOURCE_NOT_FOUND
      );

    return { user };
  };

  getUsers = async () => {
    const users = await User.find();

    return users;
  };

  deleteUser = async (userId: mongoose.Types.ObjectId) => {
    try {
      await User.findByIdAndDelete(userId);

      await Account.findOneAndDelete({ userId });

      await Workspace.findOneAndDelete({ userId });

      await Member.findOneAndDelete({ userId });
    } catch (error) {
      throw error;
    }
    return;
  };
}

export { UserService };
