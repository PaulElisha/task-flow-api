import joi from 'joi'
import { Schema, model } from "mongoose";

const roleJoiSchema = joi.object({
    type: joi.string().required(),
    permissions: joi.array().items(joi.string())
});

export const Roles = {
    OWNER: "OWNER",
    ADMIN: "ADMIN",
    MEMBER: "MEMBER",
};

export const Permissions = {
    CREATE_WORKSPACE: "CREATE_WORKSPACE",
    DELETE_WORKSPACE: "DELETE_WORKSPACE",
    EDIT_WORKSPACE: "EDIT_WORKSPACE",
    MANAGE_WORKSPACE_SETTINGS: "MANAGE_WORKSPACE_SETTINGS",

    ADD_MEMBER: "ADD_MEMBER",
    CHANGE_MEMBER_ROLE: "CHANGE_MEMBER_ROLE",
    REMOVE_MEMBER: "REMOVE_MEMBER",

    CREATE_PROJECT: "CREATE_PROJECT",
    EDIT_PROJECT: "EDIT_PROJECT",
    DELETE_PROJECT: "DELETE_PROJECT",

    CREATE_TASK: "CREATE_TASK",
    EDIT_TASK: "EDIT_TASK",
    DELETE_TASK: "DELETE_TASK",

    VIEW_ONLY: "VIEW_ONLY",
};

export const RolePermissions = {
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

const roleSchema = new Schema(
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
            default: () => RolePermissions[this.type],
        },
    },
    {
        timestamps: true,
    }
);

roleJoiSchema.statics.validate = (data) => {
    return roleJoiSchema.validate(data, { abortEarly: false });
};

export default model("Role", roleSchema);
