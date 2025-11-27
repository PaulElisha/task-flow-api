/** @format */

import express from "express";
import { MemberController } from "../controllers/member.controller.ts";

import type { Router } from "express";
import type { MemberControllerInstance } from "../types/controllers/controllers.types.ts";

class MemberRouter {
  public router: Router;
  public memberController: MemberControllerInstance;

  constructor() {
    this.router = express.Router();
    this.memberController = new MemberController();
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.post(
      "/:inviteCode/join",
      this.memberController.joinWorkspaceByInviteCode
    );
  }
}

const memberRouter = new MemberRouter().router;
export { memberRouter };
