/** @format */

import express from "express";
import passport from "passport";
import session from "express-session";

import { taskRouter } from "./src/routes/TaskRouter.js";
import { userRouter } from "./src/routes/UserRouter.js";
import { authRouter } from "./src/routes/AuthRouter.js";
import { workspaceRouter } from "./src/routes/WorkspaceRouter.js";
import { memberRouter } from "./src/routes/MemberRouter.js";
import { projectRouter } from "./src/routes/ProjectRouter.js";

import { loginLocalStrategy } from "./src/config/AuthConfig.js";
import { isAuthenticated } from "./src/middlewares/authenticate.js";

import { Db } from "./src/config/DbConfig.js";
import { port, hostName, mongoUri, sessionSecret, nodeEnv } from "./src/constants/Constants.js";

console.log("Port and Hostname:", `${port} - ${hostName} - ${mongoUri}`);

class App {
  constructor() {
    this.db = new Db();
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.passportConfig();
  }

  initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
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

  passportConfig() {
    passport.use("local", loginLocalStrategy);
    // passport.use(googleStrategy);
  }

  initializeRoutes() {
    this.app.use("/auth", authRouter);
    this.app.use("/api/users", isAuthenticated, userRouter);
    this.app.use("/api/tasks", isAuthenticated, taskRouter);
    this.app.use("/api/projects", isAuthenticated, projectRouter);
    this.app.use("/api/members", isAuthenticated, memberRouter);
    this.app.use("/api/workspaces", isAuthenticated, workspaceRouter);
  }

  startServer() {
    this.db.connect();
    this.app.listen(port, () => {
      console.log(`Server running at http://${hostName}:${port}`);
    });
  }
}

const app = new App();
app.startServer();
