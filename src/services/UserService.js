import User from "../models/User.js";

import { generateToken } from "../utils.js";

class UserService {
    async getUsers() {
        const users = await User.find();
        if (users.length == 0) {
            const error = new Error("No users found");
            error.statusCode = 404;
            throw error;
        }
        return users;
    }

    async updateUser(id, userData) {
        let user = await User.findById(id);
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        user = await User.updateOne({ _id: id }, userData);
        return user;
    }

    async deleteUser(id) {
        const user = await User.findById(id);
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        await User.deleteOne({ _id: id });
        return;
    }
}

export { UserService };