/** @format */

import { UserService } from "../../services/user.service.ts";
import { TaskService } from "../../services/task.service.ts";
import { ProjectService } from "../../services/project.service.ts";
import { WorkspaceService } from "../../services/workspace.service.ts";
import { MemberService } from "../../services/member.service.ts";
import { AuthService } from "../../services/auth.service.ts";

export type UserServiceInstance = UserService;
export type TaskServiceInstance = TaskService;
export type ProjectServiceInstance = ProjectService;
export type WorkspaceServiceInstance = WorkspaceService;
export type MemberServiceInstance = MemberService;
export type AuthServiceInstance = AuthService;
