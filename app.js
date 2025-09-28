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

import { loginLocalStrategy } from "./src/config/authConfig.js";
import { isAuthenticated } from "./src/middlewares/authenticate.js";

import { connectDb } from "./src/config/connectDb.js";

import { config } from "dotenv";
config({ path: ".env" });

const PORT = process.env.PORT;
const HOST_NAME = process.env.HOST_NAME;
const MONGODB_URI = process.env.MONGO_URI;
console.log("Port and Hostname:", `${PORT} - ${HOST_NAME} - ${MONGODB_URI}`);

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
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 24 * 60 * 60 * 1000,
          secure: process.env.NODE_ENV === "production",
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
    this.app.listen(PORT, () => {
      console.log(`Server running at http://${HOST_NAME}:${PORT}`);
    });
  }
}

const app = new App();
app.startServer();
