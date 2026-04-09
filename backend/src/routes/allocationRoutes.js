import { Router } from "express";
import { allocationController } from "../controllers/allocationController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import { writeRateLimiter } from "../middleware/rateLimitMiddleware.js";

export const allocationRoutes = Router();

allocationRoutes.get("/", authenticate, allocationController.list);
allocationRoutes.get("/:id", authenticate, allocationController.getById);
allocationRoutes.patch("/:id/approval", authenticate, authorize("Hospital Admin", "Doctor"), writeRateLimiter, allocationController.approveOrReject);
allocationRoutes.patch("/:id/transport", authenticate, authorize("Hospital Admin", "Transport Team"), writeRateLimiter, allocationController.updateTransport);
allocationRoutes.delete("/:id", authenticate, authorize("Hospital Admin"), writeRateLimiter, allocationController.remove);
