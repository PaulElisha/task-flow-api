import Member from "../models/Member";
import Workspace from "../models/Workspace";
import Role, { Roles } from "../models/Role";

class MemberService {
    getMemberRoleInWorkspace = async (userId, workSpaceId) => {
        const workspace = await Workspace.findById(workSpaceId);
        if (!workspace) {
            const error = new Error("Workspace not found");
            error.status = 404;
            throw error;
        }

        const member = await Member.findOne({ userId, workSpaceId }).populate(
            "role"
        );

        if (!member) {
            const error = new Error("Member not found in the specified workspace");
            error.status = 404;
            throw error;
        }

        let role;
        return (role = member ? member.role.type : null);
    };

    joinWorkspaceByInviteCode = async (userId, inviteCode) => {
        const workspace = await Workspace.findOne({ inviteCode }).exec();
        if (!workspace) {
            const error = new Error("Invalid invite code");
            error.status = 404;
            throw error;
        }

        const member = await Member.findOne({
            userId,
            workSpaceId: workspace._id,
        }).exec();

        if (member) {
            const error = new Error("User is already a member of this workspace");
            error.status = 400;
            throw error;
        }

        const role = await Role.findOne({ type: Roles.MEMBER });

        if (!role) {
            const error = new Error("Member role not found");
            error.status = 500;
            throw error;
        }

        const error = Member.validate({
            userId,
            workSpaceId: workspace._id,
            role: role._id,
        });
        if (error) {
            const error = new Error("Incorrect Input value");
            throw error;
        }

        await Member.create({
            userId,
            workSpaceId: workspace._id,
            role: role._id,
        });

        return { workspaceId: workspace._id, type: role.type };
    };
}

export { MemberService };
