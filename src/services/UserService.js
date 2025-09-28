/** @format */

import User from "../models/User.js";
import Account from "../models/Account.js";
import Member from "../models/Member.js";
import Workspace from "../models/Workspace.js";
class UserService {
  getCurrentUser = async (userId) => {
    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    return { user };
  };

  getUsers = async () => {
    const users = await User.find();

    return users;
  };

  deleteUser = async (userId) => {
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
