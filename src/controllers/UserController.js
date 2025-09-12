import { UserService } from "../services/UserService.js";

class UserController {
    constructor() {
        this.userService = new UserService();
    }

    getCurrentUser = async (req, res) => {
        const userId = req.user._id;

        try {
            const { user } = await this.userService.getCurrentUser(userId);

            res.status(200).json({ message: 'Fetched current user', status: 'ok', user })
        } catch (error) {
            res.status(500).json({
                message: error.message,
                status: 'error'
            })
        }
    }
}

export { UserController };