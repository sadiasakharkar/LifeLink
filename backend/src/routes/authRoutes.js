import { Router } from "express";
import { authController } from "../controllers/authController.js";
import { authRateLimiter } from "../middleware/rateLimitMiddleware.js";

export const authRoutes = Router();

authRoutes.post("/signup", authRateLimiter, authController.signup);
authRoutes.post("/login", authRateLimiter, authController.login);
