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
    this.router.get("/current/:id", this.userController.getCurrentUser);
    this.router.get("/all", this.userController.getUsers);
    this.router.delete("/remove/:id", this.userController.deleteUser);
  }
}

const userRouter = new UserRouter().router;
export { userRouter };
