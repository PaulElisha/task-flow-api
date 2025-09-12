import express from 'express'
import { MemberController } from '../controllers/MemberController'


class MemberRouter {

    constructor() {
        this.router = express.Router();
        this.memberController = new MemberController();
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.post('/workspace/:inviteCode/join', this.memberController.joinWorkspaceByInviteCode);
    }
}

const memberRouter = new MemberRouter().router;
export { memberRouter }