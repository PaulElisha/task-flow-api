/** @format */

import mongoose from "mongoose";
import User from "../models/User.js";
import Account, { Provider } from "../models/Account.js";
import Workspace from "../models/Workspace.js";
import Role, { Roles } from "../models/Role.js";
import Member from "../models/Member.js";

class AuthService {
  constructor() {
    this.session = null;
  }

  run = async () => {
    this.session = await mongoose.startSession();
    this.session.startTransaction();
  };

  googleLoginOrRegister = async (data) => {
    const { provider, providerId, displayName, picture, email } = data;

    try {
      await this.run();
      let user = await User.findOne({ email }).session(this.session);

      if (!user)
        user = await User.create(
          { name: displayName, email, picture },
          { session: this.session }
        );

      let account = await Account.create(
        { userId: user._id, provider, providerId },
        { session: this.session }
      );

      const workspace = await Workspace.create(
        {
          name: `My Workspace`,
          description: `Welcome to ${user.name} workspace`,
          userId: user._id,
        },
        { session: this.session }
      );

      const ownerRole = await Role.findOne({ name: Roles.OWNER }).session(
        this.session
      );

      if (!ownerRole) throw new Error("Owner role not found");

      const member = await Member.create({
        userId: user._id,
        workSpaceId: workspace._id,
        role: ownerRole._id,
      });

      user.currentWorkspace = workspace._id;

      await user.save({ session: this.session });

      await this.session.commitTransaction();
      this.session.endSession();

      return { user };
    } catch (error) {
      await this.session.abortTransaction();
      this.session.endSession();
      throw error;
    } finally {
      this.session.endSession();
    }
  };

  localRegister = async (body) => {
    const { email, name, password } = body;

    try {
      await this.run();
      let user = await User.findOne({ email }).session(this.session);

      if (user) throw new Error("Email already exists");

      user = await User.create(
        { email, name, password },
        { session: this.session }
      );

      const account = await Account.create(
        {
          userId: user._id,
          provider: Provider.EMAIL,
          providerId: email,
        },
        { session: this.session }
      );

      const workspace = await Workspace.create(
        {
          name: `My Workspace`,
          description: `Welcome to ${user.name} workspace`,
          userId: user._id,
        },
        { session: this.session }
      );

      const ownerRole = await Role.findOne({ type: Roles.OWNER }).session(
        this.session
      );

      if (!ownerRole) throw new Error("Owner role not found");

      const member = await Member.create(
        {
          userId: user._id,
          workspaceId: workspace._id,
          role: ownerRole._id,
        },
        { session: this.session }
      );

      user.currentWorkspace = workspace._id;

      await user.save({ session: this.session });

      await this.session.commitTransaction();
      await this.session.endSession();

      return {
        userId: user._id,
        workspaceId: workspace._id,
      };
    } catch (error) {
      await this.session.abortTransaction();
      this.session.endSession();

      throw error;
    }
  };

  localLogin = async ({ email, password, provider = Provider.EMAIL }) => {
    const account = await Account.findOne({ provider, providerId: email });

    if (!account) throw new Error("Invalid email or password");

    const user = await User.findById(account.userId);

    if (!user) throw new Error("User not found");

    const isMatch = user.comparePassword(password);

    if (!isMatch) throw new Error("Invalid email or password");

    return user;
  };
}

export { AuthService };
