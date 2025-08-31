import express from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/AuthController.js';


class AuthRouter {
    constructor() {
        this.router = express.Router();
        this.authController = new AuthController();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post('/signup', passport.authenticate('signup', { session: false }), this.authController.handleSignup);
        this.router.post('/login', this.authController.handleLogin);
    }
}

const authRouter = new AuthRouter().router;
export { authRouter }