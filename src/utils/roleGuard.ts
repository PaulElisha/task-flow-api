/** @format */

import { HTTP_STATUS } from "../config/http.config.ts";
import { PermissionType, RoleType } from "../enums/role.enum.ts";
import { UnauthorizedExceptionError } from "../errors/unauthorized-exception.error.ts";
import { RolePermissions } from "../models/role.model.ts";

export const roleGuard = () => {
  const check = (role: RoleType, requiredPermission: Array<PermissionType>) => {
    const permissions = RolePermissions[role];

    const hasPermission = requiredPermission.every((permission) =>
      permissions.includes(permission)
    );

    if (!hasPermission) {
      throw new UnauthorizedExceptionError(
        "Unauthorized",
        HTTP_STATUS.UNAUTHORIZED
      );
    }
  };

  return { check };
};
