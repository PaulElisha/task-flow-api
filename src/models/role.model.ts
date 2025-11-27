/** @format */

import { Schema, model, Document } from "mongoose";

import {
  Roles,
  Permissions,
  RolePermission,
  PermissionType,
  RoleType,
} from "../enums/role.enum.ts";

export const RolePermissions: RolePermission = {
  [Roles.OWNER]: Object.values(Permissions),
  [Roles.ADMIN]: [
    Permissions.CREATE_PROJECT,
    Permissions.EDIT_PROJECT,
    Permissions.DELETE_PROJECT,
    Permissions.CREATE_TASK,
    Permissions.EDIT_TASK,
    Permissions.DELETE_TASK,
    Permissions.ADD_MEMBER,
    Permissions.CHANGE_MEMBER_ROLE,
    Permissions.REMOVE_MEMBER,
    Permissions.MANAGE_WORKSPACE_SETTINGS,
  ],
  [Roles.MEMBER]: [
    Permissions.CREATE_PROJECT,
    Permissions.EDIT_PROJECT,
    Permissions.DELETE_PROJECT,
    Permissions.CREATE_TASK,
    Permissions.EDIT_TASK,
    Permissions.DELETE_TASK,
  ],
};

export type RolePermissionKey = keyof RolePermission;
export type RolePermissionType = RolePermission[RolePermissionKey];

export interface RoleDocument extends Document {
  type: RoleType;
  permissions: Array<PermissionType>;
}

const roleSchema = new Schema<RoleDocument>(
  {
    type: {
      type: String,
      enum: Object.values(Roles),
      required: true,
      unique: true,
    },
    permissions: {
      type: [String],
      enum: Object.values(Permissions),
      required: true,
      default: function (this: RoleDocument) {
        return RolePermissions[this.type];
      },
    },
  },
  {
    timestamps: true,
  }
);

export default model<RoleDocument>("Role", roleSchema);
