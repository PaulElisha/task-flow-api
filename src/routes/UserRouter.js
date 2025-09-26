/** @format */

import express from "express";
import { UserController } from "../controllers/UserController.js";

class UserRouter {
  constructor() {
    this.router = express.Router();
    this.userController = new UserController();
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.delete("/current", this.userController.getCurrentUser);
  }
}

const userRouter = new UserRouter().router;
export { userRouter };
