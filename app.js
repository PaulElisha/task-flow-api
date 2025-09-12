import express from 'express';
import passport from 'passport';

import { taskRouter } from './src/routes/TaskRouter.js';
import { userRouter } from './src/routes/UserRouter.js';
import { authRouter } from './src/routes/AuthRouter.js';
import { workspaceRouter } from './src/routes/WorkspaceRouter.js'
import { memberRouter } from './src/routes/MemberRouter.js'
import { projectRouter } from './src/routes/ProjectRouter.js'

import { jwtconfig } from './src/config/authConfig.js';
import { connectDb } from './src/config/dbConfig.js';

import { config } from 'dotenv';
config({ path: ".env" });

const port = process.env.PORT;
const hostname = process.env.HOSTNAME;
const MONGODB_URI = process.env.MONGODB_URI;
console.log("Port and Hostname:", `${port} - ${hostname} - ${MONGODB_URI}`);


class App {
    constructor() {
        this.db = new connectDb();
        this.app = express();
        this.initializeMiddlewares();
        this.initializeRoutes();
    }

    initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    jwtConfig() {
        const { jwtStrategy, localLoginStrategy, localSignupStrategy } = jwtconfig;
        passport.use(jwtStrategy)
        passport.use('signup', localSignupStrategy);
        passport.use('login', localLoginStrategy);
    }

    initializeRoutes() {
        this.app.use("/", authRouter)
        this.app.use('/api/users', passport.authenticate("jwt", { session: false }), userRouter);
        this.app.use('/api/tasks', passport.authenticate("jwt", { session: false }), taskRouter);
        this.app.use('/api/projects', passport.authenticate("jwt", { session: false }), projectRouter);
        this.app.use('/api/members', passport.authenticate("jwt", { session: false }), memberRouter);
        this.app.use('/api/workspace', passport.authenticate("jwt", { session: false }), workspaceRouter);

    }

    startServer() {
        this.app.listen(port, () => {
            console.log(`Server running at http://${hostname}:${port}/`);
        });
    }
}

const app = new App();
app.startServer();
