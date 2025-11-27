/** @format */

import { MemberService } from "../services/member.service.ts";

import type { Request, Response } from "express";
import { MemberServiceInstance } from "../types/services/services.types.ts";
import { handleAsyncControl } from "../middlewares/handleAsyncControl.middleware.ts";
import { HTTP_STATUS } from "../config/http.config.ts";

class MemberController {
  public memberService: MemberServiceInstance;

  constructor() {
    this.memberService = new MemberService();
  }

  joinWorkspaceByInviteCode = handleAsyncControl(
    async (
      req: Request<{ inviteCode: string }>,
      res: Response
    ): Promise<Response> => {
      const userId = req.user?._id;
      const inviteCode = req.params.inviteCode;

      try {
        const { workspaceId, type } =
          await this.memberService.joinWorkspaceByInviteCode(
            userId,
            inviteCode
          );

        return res.status(HTTP_STATUS.ACCEPTED).json({
          message: "Joined workspace successfully",
          status: "ok",
          data: { workspaceId, type },
        });
      } catch (error) {
        throw error;
      }
    }
  );
}

export { MemberController };
