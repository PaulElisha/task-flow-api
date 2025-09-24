/** @format */

import User from "../models/User.js";
class UserService {
  getCurrentUser = async (userId) => {
    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    return { user };
  };
}

export { UserService };
