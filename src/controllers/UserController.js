import { UserService } from "../services/UserService.js";

class UserController {
    constructor() {
        this.userService = new UserService();
    }

    async getUsers(req, res) {
        try {
            const users = await this.userService.getUsers();
            res.status(200).json({ status: "ok", message: "User created successfully", data: users });
        } catch (error) {
            res.status(500).json(error.message);
        }
    }

    async createUser(req, res) {
        try {
            const data = await this.userService.createUser(req.body);
            res.status(201).json({ status: "ok", message: "User created successfully", data });
        } catch (error) {
            res.status(500).json(error.message);
        }
    }

    async updateUser(req, res) {
        try {
            await this.userService.updateUser(req.params.id, req.body);
            res.status(200).json({ status: "ok", message: "User updated successfully" });
        } catch (error) {
            res.status(500).json(error.message);
        }

    }

    async deleteUser(req, res) {
        try {
            await this.userService.deleteUser(req.params.id);
            res.status(200).json({ status: "ok", message: "User deleted successfully" });
        } catch (error) {
            res.status(500).json(error.message);
        }
    }
}

export { UserController };