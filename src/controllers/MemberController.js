/** @format */

import { MemberService } from "../services/MemberService.js";

class MemberController {
  constructor() {
    this.memberService = new MemberService();
  }

  joinWorkspaceByInviteCode = async (req, res) => {
    const { userId } = req.user;
    const { inviteCode } = req.params;

    try {
      const { workspaceId, roleType } =
        await this.memberService.joinWorkspaceByInviteCode(userId, inviteCode);
      res.status(200).json({
        message: "Joined workspace successfully",
        status: "ok",
        data: { workspaceId, roleType },
      });
    } catch (error) {
      res.status(500).json({ message: error.message, status: "error" });
    }
  };
}

export { MemberController };
