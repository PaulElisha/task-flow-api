/** @format */

import express from "express";
import passport from "passport";
import { AuthController } from "../controllers/auth.controller.ts";

import type { Router } from "express";
import type { AuthControllerInstance } from "../types/controllers/controllers.types.ts";

class AuthRouter {
  public router: Router;
  public authController: AuthControllerInstance;

  constructor() {
    this.router = express.Router();
    this.authController = new AuthController();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/register", this.authController.handleSignup);
    this.router.post("/login", this.authController.handleLogin);
    this.router.post("/logout", this.authController.handleLogout);
    this.router.get(
      "/google",
      passport.authenticate("google", { scope: ["profile", "email"] })
    );
  }
}

const authRouter = new AuthRouter().router;
export { authRouter };
