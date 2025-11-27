/** @format */

import mongoose from "mongoose";

import { Db } from "../config/db.config.ts";
import Role, {
  RoleDocument,
  RolePermissionKey,
  RolePermissions,
  RolePermissionType,
} from "../models/role.model.ts";

import type { DbConfig } from "../types/config/db.types.ts";
import type { ClientSession } from "mongoose";

class Seeder {
  public db: DbConfig | undefined;
  public session: ClientSession | undefined;

  constructor() {
    this.db = new Db();
  }

  startSession = async (): Promise<ClientSession> => {
    try {
      if (this.session) return this.session;
      else this.session = await mongoose.startSession();
      return this.session;
    } catch (error) {
      throw error;
    }
  };

  clearExistingRoles = async (session: ClientSession): Promise<void> => {
    try {
      await Role.deleteMany({}, { session });
    } catch (error) {
      throw error;
    }
  };

  run = async (): Promise<void> => {
    let session: ClientSession | undefined;
    try {
      await this.db?.connect();
      session = await this.startSession();
      session?.startTransaction();

      await this.clearExistingRoles(session);

      await this.seedRoles(session);
      await session?.commitTransaction();
    } catch (error) {
      await session?.abortTransaction();
      console.log("Transaction aborted", error);
      throw error;
    } finally {
      await session?.endSession();
    }
  };

  seedRoles = async (session: ClientSession) => {
    for (const role in RolePermissions) {
      const permissions: RolePermissionType =
        RolePermissions[role as RolePermissionKey];
      try {
        const existRole: RoleDocument | null = await Role.findOne({
          type: role,
        }).session(session);
        if (!existRole) {
          await Role.create([{ type: role, permissions }], {
            session,
          });
          console.log(`Role created with permissions`);
        }
      } catch (error) {
        throw error;
      }
    }
  };
}

export { Seeder };
