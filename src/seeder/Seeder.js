/** @format */

import mongoose from "mongoose";
import { connectDb } from "../config/connectDb.js";
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
    } finally {
      await this.session.endSession();
    }
  };

  seedRoles = async () => {
    for (const role of RolePermissions) {
      const permissions = RolePermissions[role];

      let role = await Role.findOne({ type: role }).session(this.session);
      if (!existingRole) {
        role = await Role.create([{ type: role, permissions }], {
          session: this.session,
        });
        console.log(
          `Role ${role} created with permissions: ${permissions.join(", ")}`
        );
      } else console.log(`Role ${role} already exists. Skipping...`);
    }
  };
}

await new Seeder().run();
