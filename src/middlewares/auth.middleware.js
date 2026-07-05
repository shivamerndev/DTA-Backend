import { AppError } from "../utils/error.utils.js";
import { verifyAccessToken } from "../utils/token.utils.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import MongoUserRepository from "../repository/mongo.user.js";

export const userAuth = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies?.token;
  if (!token) throw new AppError(401, "Not authenticated");

  try {
    const decoded = verifyAccessToken(token);
    const user = await MongoUserRepository.findUserById(decoded.id);
    if (!user) throw new AppError(404, "User not found");
    req.user = user;
    next();
  } catch (error) {
    throw new AppError(401, "Invalid or expired token");
  }
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError(403, "Access denied. Insufficient permissions.");
    }
    next();
  };
};