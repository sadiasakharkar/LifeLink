import { Router } from "express";
import { auditLogController } from "../controllers/auditLogController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

export const auditLogRoutes = Router();

auditLogRoutes.get("/", authenticate, authorize("Hospital Admin"), auditLogController.list);
