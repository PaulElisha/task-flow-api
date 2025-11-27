/** @format */

import passport from "passport";
import { AuthService } from "../services/auth.service.ts";
import { AuthServiceInstance } from "../types/services/services.types.ts";

import type { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../config/http.config.ts";
import { handleAsyncControl } from "../middlewares/handleAsyncControl.middleware.ts";
import { UnauthorizedExceptionError } from "../errors/unauthorized-exception.error.ts";

class AuthController {
  public authService: AuthServiceInstance;

  constructor() {
    this.authService = new AuthService();
  }

  handleSignup = handleAsyncControl(
    async (req: Request, res: Response): Promise<Response> => {
      try {
        await this.authService.localRegister(req.body);
        return res
          .status(HTTP_STATUS.CREATED)
          .json({ message: "User registered successfully" });
      } catch (error) {
        throw error;
      }
    }
  );

  handleLogin = handleAsyncControl(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      passport.authenticate(
        "local",
        (
          err: Error | null,
          user: Express.User | false,
          info: { message: string }
        ) => {
          try {
            if (err) {
              next(err);
            }

            if (!user) {
              return next(
                new UnauthorizedExceptionError(
                  info?.message || "Invalid email or password",
                  HTTP_STATUS.UNAUTHORIZED
                )
              );
            }

            req.login(user, (err) => {
              if (err) {
                return next(err);
              }

              return res
                .status(HTTP_STATUS.OK)
                .json({ message: "User logged in successfully", status: "ok" });
            });
          } catch (error) {
            return next(error);
          }
        }
      )(req, res, next);
    }
  );

  handleLogout = handleAsyncControl(
    async (req: Request, res: Response): Promise<Response> => {
      req.logout((error) => {
        if (error) {
          throw error;
        }
      });

      req.session = null as any;
      return res
        .status(HTTP_STATUS.OK)
        .json({ message: "Logout successful", status: "ok" });
    }
  );
}

export { AuthController };
