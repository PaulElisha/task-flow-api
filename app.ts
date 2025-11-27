/** @format */

import express from "express";
import passport from "passport";
import session from "express-session";
import cors from "cors";

import { taskRouter } from "./src/routes/task.route.ts";
import { userRouter } from "./src/routes/user.route.ts";
import { authRouter } from "./src/routes/auth.route.ts";
import { workspaceRouter } from "./src/routes/workspace.route.ts";
import { memberRouter } from "./src/routes/member.route.ts";
import { projectRouter } from "./src/routes/project.route.ts";

import { authconfig } from "./src/config/auth.config.ts";
import { authenticate } from "./src/middlewares/auth.middleware.ts";
import { errorHandler } from "./src/middlewares/errorHandler.middleware.ts";

import { Db } from "./src/config/db.config.ts";
import {
  port,
  hostName,
  mongoUri,
  sessionSecret,
  nodeEnv,
} from "./src/constants/constants.ts";

import type { Express } from "express";
import type { DbConfig } from "./src/types/config/db.types.ts";

console.log("Port and Hostname:", `${port} - ${hostName} - ${mongoUri}`);

class App {
  public app: Express;
  public db: DbConfig | undefined;

  constructor() {
    this.db = new Db();
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.passportConfig();
  }

  initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(
      cors({
        origin: "*",
        credentials: true,
      })
    );
    this.app.use(
      session({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 24 * 60 * 60 * 1000,
          secure: nodeEnv === "production",
          httpOnly: true,
          sameSite: "lax",
        },
      })
    );
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  passportConfig(): void {
    passport.use("local", authconfig.localLoginStrategy);
    // passport.use(googleStrategy);
  }

  initializeRoutes(): void {
    this.app.use("/auth", authRouter);
    this.app.use("/api/users", authenticate, userRouter);
    this.app.use("/api/tasks", authenticate, taskRouter);
    this.app.use("/api/projects", authenticate, projectRouter);
    this.app.use("/api/members", authenticate, memberRouter);
    this.app.use("/api/workspaces", authenticate, workspaceRouter);

    this.app.use(errorHandler);
  }

  startServer(): void {
    this.db?.connect();
    this.app.listen(port, (): void => {
      console.log(`Server running at http://${hostName}:${port}`);
    });
  }
}

const app = new App();
app.startServer();
