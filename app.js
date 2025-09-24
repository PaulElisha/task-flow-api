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
  }

  initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  passportConfig() {
    passport.use(localLoginStrategy);
    passport.use(googleStrategy);
  }

  initializeRoutes() {
    this.app.use("/auth", authRouter);
    this.app.use("/api/users", userRouter);
    this.app.use("/api/tasks", taskRouter);
    this.app.use("/api/projects", projectRouter);
    this.app.use("/api/members", memberRouter);
    this.app.use("/api/workspace", workspaceRouter);
  }

  startServer() {
    this.app.listen(port, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });
  }
}

const app = new App();
app.startServer();
