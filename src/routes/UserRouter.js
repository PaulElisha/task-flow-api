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
        this.router.put("/:id", this.userController.updateUser);
        this.router.delete("/:id", this.userController.deleteUser);
    }
}

const userRouter = new UserRouter().router;
export { userRouter };