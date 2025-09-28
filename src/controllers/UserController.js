/** @format */

import { UserService } from "../services/UserService.js";

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  getCurrentUser = async (req, res) => {
    try {
      const { user } = await this.userService.getCurrentUser(req.params.id);
      res
        .status(200)
        .json({ message: "Fetched current user", status: "ok", user });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        status: "error",
      });
    }
  };

  getUsers = async (req, res) => {
    try {
      const users = await this.userService.getUsers();
      res.status(200).json({ message: "Fetched all users", users });
    } catch (error) {
      res.status(500).json(error.message);
    }
  };

  deleteUser = async (req, res) => {
    try {
      await this.userService.deleteUser(req.params.id);
      res
        .status(200)
        .json({ message: "User deleted successfully", status: "ok" });
    } catch (error) {
      res.status(500).json({ message: error.message, status: "error" });
    }
  };
}

export { UserController };
