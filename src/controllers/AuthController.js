/** @format */

import jwt from "jsonwebtoken";
import passport from "passport";
import { AuthService } from "../services/AuthService";

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  handleSignup = async (req, res) => {
    await this.authService.registerUser(req.body);

    return res.status(200).json({ message: "User registered successfully" });
  };

  handleLogin = async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      try {
        if (err || !user) {
          err = err || new Error("Login failed");
          return next(err);
        }

        req.login(user, (err) => {
          if (err) {
            return next(err);
          }

          res
            .status(200)
            .json({ message: "User logged in successfully", status: "ok" });
        });
      } catch (error) {
        return next(error);
      }
    })(req, res, next);
  };

  handleLogout = async (req, res) => {
    req.logout((err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Failed to logout", status: "error" });
      }
    });

    req.session = null;
    return res.status(200).json({ message: "Logout successful", status: "ok" });
  };
}

export { AuthController };
