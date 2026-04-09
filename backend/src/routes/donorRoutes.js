import { Router } from "express";
import { donorController } from "../controllers/donorController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import { writeRateLimiter } from "../middleware/rateLimitMiddleware.js";

export const donorRoutes = Router();

donorRoutes.get("/", authenticate, donorController.list);
donorRoutes.get("/:id", authenticate, donorController.getById);
donorRoutes.post("/", authenticate, authorize("Hospital Admin"), writeRateLimiter, donorController.create);
donorRoutes.patch("/:id", authenticate, authorize("Hospital Admin"), writeRateLimiter, donorController.update);
donorRoutes.delete("/:id", authenticate, authorize("Hospital Admin"), writeRateLimiter, donorController.remove);
