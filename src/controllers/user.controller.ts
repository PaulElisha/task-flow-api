/** @format */

import { UserService } from "../services/user.service.ts";

import type { Request, Response } from "express";
import type { UserServiceInstance } from "../types/services/services.types.ts";
import { handleAsyncControl } from "../middlewares/handleAsyncControl.middleware.ts";
import { HTTP_STATUS } from "../config/http.config.ts";

class UserController {
  public userService: UserServiceInstance;

  constructor() {
    this.userService = new UserService();
  }

  getCurrentUser = handleAsyncControl(
    async (req: Request, res: Response): Promise<Response> => {
      try {
        const { user } = await this.userService.getCurrentUser(req.user?.id);
        return res
          .status(HTTP_STATUS.OK)
          .json({ message: "Fetched current user", status: "ok", user });
      } catch (error) {
        throw error;
      }
    }
  );

  getUsers = handleAsyncControl(
    async (req: Request, res: Response): Promise<Response> => {
      try {
        const users = await this.userService.getUsers();
        return res
          .status(HTTP_STATUS.OK)
          .json({ message: "Fetched all users", users });
      } catch (error) {
        throw error;
      }
    }
  );

  deleteUser = handleAsyncControl(
    async (req: Request, res: Response): Promise<Response> => {
      try {
        await this.userService.deleteUser(req.user?.id);
        return res
          .status(HTTP_STATUS.OK)
          .json({ message: "User deleted successfully", status: "ok" });
      } catch (error) {
        throw error;
      }
    }
  );
}

export { UserController };
