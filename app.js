/** @format */

import express from "express";
import passport from "passport";

import { taskRouter } from "./src/routes/TaskRouter.js";
import { userRouter } from "./src/routes/UserRouter.js";
import { authRouter } from "./src/routes/AuthRouter.js";
import { workspaceRouter } from "./src/routes/WorkspaceRouter.js";
import { memberRouter } from "./src/routes/MemberRouter.js";
import { projectRouter } from "./src/routes/ProjectRouter.js";

import { localLoginStrategy, googleStrategy } from "./src/config/authConfig.js";
import { isAuthenticated } from "./src/middlewares/authenticate.js";

import { connectDb } from "./src/config/connectDb.js";

import { config } from "dotenv";
config({ path: ".env" });

const port = process.env.PORT;
const hostname = process.env.HOSTNAME;
const MONGODB_URI = process.env.MONGODB_URI;
console.log("Port and Hostname:", `${port} - ${hostname} - ${MONGODB_URI}`);

class App {
  constructor() {
    new connectDb();
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
        name: "session",
        keys: [process.env.SESSION_SECRET],
        maxAge: 24 * 60 * 60 * 1000,
        secure: config.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
      })
    );
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  passportConfig() {
    passport.use("local", localLoginStrategy);
    passport.use(googleStrategy);
  }

  initializeRoutes() {
    this.app.use("/auth", authRouter);
    this.app.use("/api/users", isAuthenticated, userRouter);
    this.app.use("/api/tasks", isAuthenticated, taskRouter);
    this.app.use("/api/projects", isAuthenticated, projectRouter);
    this.app.use("/api/members", isAuthenticated, memberRouter);
    this.app.use("/api/workspace", isAuthenticated, workspaceRouter);
  }

  startServer() {
    this.app.listen(port, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });
  }
}

const app = new App();
app.startServer();
