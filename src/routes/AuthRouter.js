/** @format */

import express from "express";
import passport from "passport";
import { AuthController } from "../controllers/AuthController.js";

class AuthRouter {
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
