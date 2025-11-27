/** @format */

import mongoose from "mongoose";
import User from "../models/user.model.ts";
import Workspace from "../models/workspace.model.ts";
import Account from "../models/account.model.ts";
import Role from "../models/role.model.ts";
import Member from "../models/member.model.ts";

import { Provider, ProviderType } from "../enums/account-provider.enum.ts";
import { Roles } from "../enums/role.enum.ts";

import type { ClientSession } from "mongoose";
import { NotFoundExceptionError } from "../errors/not-found-exception.error.ts";
import { HTTP_STATUS } from "../config/http.config.ts";
import { BadRequestError } from "../errors/bad-request.error.ts";
import { UnauthorizedExceptionError } from "../errors/unauthorized-exception.error.ts";

class AuthService {
  run = async () => {
    const session = await mongoose.startSession();
    session?.startTransaction();
    return session;
  };

  // googleLoginOrRegister = async (data) => {
  //   const { provider, providerId, displayName, picture, email } = data;
  //   let session: ClientSession | undefined;
  //   try {
  //     session = await this.run();
  //     let user = await User.findOne({ email }).session(session);

  //     if (!user)
  //       user = await User.create(
  //         { name: displayName, email, picture },
  //         { session }
  //       );

  //     let account = await Account.create(
  //       { userId: user._id, provider, providerId },
  //       { session }
  //     );

  //     const workspace = await Workspace.create(
  //       {
  //         name: `My Workspace`,
  //         description: `Welcome to ${user.name} workspace`,
  //         userId: user._id,
  //       },
  //       { session }
  //     );

  //     const ownerRole = await Role.findOne({ name: Roles.OWNER }).session(
  //       session
  //     );

  //     if (!ownerRole) throw new Error("Owner role not found");

  //     const member = await Member.create({
  //       userId: user._id,
  //       workSpaceId: workspace._id,
  //       role: ownerRole._id,
  //     });

  //     user.currentWorkspace = workspace._id;

  //     await user.save({ session });

  //     await session?.commitTransaction();
  //     session?.endSession();

  //     return { user };
  //   } catch (error) {
  //     await session?.abortTransaction();
  //     throw error;
  //   } finally {
  //     await session?.endSession();
  //   }
  // };

  localRegister = async (body: {
    email: string;
    name: string;
    password: string;
  }) => {
    const { email, name, password } = body;

    let session: ClientSession | undefined;
    try {
      session = await this.run();
      const existingUser = await User.findOne({ email }).session(session);
      if (existingUser) throw new Error("Email already exists");

      let [user] = await User.create([{ email, name, password }], {
        session,
      });

      console.log("User Id:", user);
      await Account.create(
        [
          {
            userId: user._id,
            provider: Provider.EMAIL,
            providerId: email,
          },
        ],
        { session }
      );

      const [workspace] = await Workspace.create(
        [
          {
            name: `New Workspace`,
            description: `Welcome to ${name} workspace`,
            userId: user._id,
          },
        ],
        { session }
      );

      const ownerRole = await Role.findOne({ type: Roles.OWNER }).session(
        session
      );
      if (!ownerRole)
        throw new NotFoundExceptionError(
          "Owner role not found",
          HTTP_STATUS.NOT_FOUND
        );

      await Member.create(
        [
          {
            userId: user._id,
            workSpaceId: workspace._id,
            role: ownerRole._id,
          },
        ],
        { session }
      );

      user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
      await user.save({ session });

      await session.commitTransaction();
      return {
        userId: user._id,
        workspaceId: workspace._id,
      };
    } catch (error) {
      await session?.abortTransaction();
      throw error;
    } finally {
      await session?.endSession();
    }
  };

  localLogin = async ({
    email,
    password,
    provider = Provider.EMAIL,
  }: {
    email: string;
    password: string;
    provider?: string;
  }) => {
    try {
      const account = await Account.findOne({ provider, providerId: email });

      if (!account)
        throw new NotFoundExceptionError(
          "Account not found",
          HTTP_STATUS.NOT_FOUND
        );

      const user = await User.findById(account.userId);

      if (!user)
        throw new NotFoundExceptionError(
          "User not found",
          HTTP_STATUS.NOT_FOUND
        );

      const isMatch = user.comparePassword(password);

      if (!isMatch)
        throw new UnauthorizedExceptionError(
          "Invalid email or password",
          HTTP_STATUS.UNAUTHORIZED
        );

      return user.omitPassword();
    } catch (error) {
      throw error;
    }
  };
}

export { AuthService };
