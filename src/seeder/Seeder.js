/** @format */

import mongoose from "mongoose";
import connectDb from "../config/connectDb.js";
import Role, { Roles, Permissions, RolePermissions } from "../models/Role.js";

class Seeder {
    constructor() {
        this.dbConnected = connectDb();
        this.session = mongoose.startSession();
        this.session.startTransaction();
        this.seedRoles();
    }

    clearExistingRoles = async () => {
        await Role.deleteMany({}, { session: this.session });
    };

    seedRoles = async () => {
        for (const role of RolePermissions) {
            const permissions = RolePermissions[role];

            const existingRole = await Role.findOne({ type: role }).session(
                this.session
            );
            if (!existingRole) {
                const newRole = await Role.create([{ type: role, permissions }], {
                    session: this.session,
                });
                console.log(
                    `Role ${newRole} created with permissions: ${permissions.join(", ")}`
                );
            }
            console.log(`Role ${role} already exists. Skipping...`);
        }

        await this.session.commitTransaction();
        console.log("Transaction committed.");
        this.session.endSession();
        console.log("Seeding completed.");
    };
}

export default Seeder;
