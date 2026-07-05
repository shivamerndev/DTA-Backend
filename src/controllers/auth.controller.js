import authService from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class AuthController {
    constructor() {
        this.cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
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


    logout = asyncHandler(async (req, res) => {
        const userId = req.user.id || req.user._id;

        await authService.logout(userId);

        res.clearCookie("token", this.cookieOptions);

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