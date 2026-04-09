import { Router } from "express";
import { recipientController } from "../controllers/recipientController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import { writeRateLimiter } from "../middleware/rateLimitMiddleware.js";

export const recipientRoutes = Router();

recipientRoutes.post("/", authenticate, authorize("Hospital Admin"), writeRateLimiter, recipientController.create);
recipientRoutes.get("/", authenticate, authorize("Hospital Admin", "Doctor"), recipientController.list);
recipientRoutes.get("/:id", authenticate, authorize("Hospital Admin", "Doctor"), recipientController.getById);
recipientRoutes.patch("/:id", authenticate, authorize("Hospital Admin", "Doctor"), writeRateLimiter, recipientController.update);
recipientRoutes.patch("/:id/urgency", authenticate, authorize("Hospital Admin", "Doctor"), writeRateLimiter, recipientController.update);
recipientRoutes.delete("/:id", authenticate, authorize("Hospital Admin"), writeRateLimiter, recipientController.remove);
