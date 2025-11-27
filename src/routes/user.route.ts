import express from "express";
import { UserController } from "../controllers/user.controllers.ts";

import type { Router } from "express";
import type { UserControllerInstance } from '../types/controllers/controllers.types.ts'

class UserRouter {
  public router: Router;
  public userController: UserControllerInstance;

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
