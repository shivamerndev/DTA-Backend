import authService from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class AuthController {
    constructor() {
        this.cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000 // 1 hour
        };
    }

    register = asyncHandler(async (req, res) => {
        let accessToken = await authService.register(req.body);
        res.cookie("token", accessToken, this.cookieOptions);
        res.success(201, "Registered Successfully.");
    });

    login = asyncHandler(async (req, res) => {
        let accessToken = await authService.login(req.body);
        res.cookie("token", accessToken, this.cookieOptions);
        res.success(200, "LoggedIn Successfully.");
    });

    getUser = asyncHandler(async (req, res) => {
        const userId = req.user.id || req.user._id;
        let user = await authService.getUser(userId);
        res.success(200, "User Fetched Successfully", user);
    });

    updateUser = asyncHandler(async (req, res) => {
        const userId = req.user.id || req.user._id;
        const updates = req.body;
        let user = await authService.updateUser(userId, updates);
        res.success(200, "Updated Successfully", user);
    });

    logout = asyncHandler(async (req, res) => {
        const userId = req.user.id || req.user._id;
        const refresh_token = req.cookies.refresh_token;

        await authService.logout(userId, refresh_token);

        res.clearCookie("token", this.cookieOptions);
        res.clearCookie("refresh_token", this.cookieOptions);

        res.success(200, "Logged Out Successfully.");
    });

    getManagers = asyncHandler(async (req, res) => {
        const managers = await authService.getManagers();
        res.success(200, "Managers Fetched Successfully", managers);
    });

    getAllUsers = asyncHandler(async (req, res) => {
        const users = await authService.getAllUsers();
        res.success(200, "All Users Fetched Successfully", users);
    });
}

export default new AuthController();