/** @format */

import mongoose from "mongoose";
import { connectDb } from "../config/DbConfig.js";
import Role, { Roles, Permissions, RolePermissions } from "../models/Role.js";

class Seeder {
  constructor() {
    this.session = null;
  }

  clearExistingRoles = async () => {
    await Role.deleteMany({}, { session: this.session });
  };

  run = async () => {
    try {
      new connectDb();
      this.session = await mongoose.startSession();
      this.session.startTransaction();

      await this.clearExistingRoles();

      await this.seedRoles();
      await this.session.commitTransaction();
    } catch (error) {
      await this.session.abortTransaction();
      console.log("Transaction aborted", error);
      throw error;
    } finally {
      await this.session.endSession();
    }
  };

  seedRoles = async () => {
    for (const role in RolePermissions) {
      const permissions = RolePermissions[role];

      const existRole = await Role.findOne({ type: role }).session(
        this.session
      );
      if (!existRole) {
        const newRole = await Role.create([{ type: role, permissions }], {
          session: this.session,
        });
        console.log(`Role created with permissions`);
      } else {
        console.log(`Role already exists. Skipping...`);
      }
    }
  };
}

export { Seeder };
