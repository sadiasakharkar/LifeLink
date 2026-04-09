import { Router } from "express";
import { matchController } from "../controllers/matchController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import { writeRateLimiter } from "../middleware/rateLimitMiddleware.js";

export const matchRoutes = Router();

matchRoutes.post("/", authenticate, authorize("Hospital Admin", "Doctor"), matchController.preview);
matchRoutes.post("/allocate", authenticate, authorize("Hospital Admin"), writeRateLimiter, matchController.allocate);
matchRoutes.get("/latest", authenticate, matchController.latest);
