import express from 'express';
import { UserController } from "../controllers/UserController.js";
import { UserAuthorization } from "../middlewares/AuthorizeUser.js";

class UserRouter {
    constructor() {
        this.router = express.Router();
        this.userAccess = new UserAuthorization();
        this.userController = new UserController();
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.delete("/current", this.userController.getCurrentUser);
    }
}

const userRouter = new UserRouter().router;
export { userRouter };