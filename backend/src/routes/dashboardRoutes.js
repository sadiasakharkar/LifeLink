import { Router } from "express";
import { dashboardController } from "../controllers/dashboardController.js";
import { authenticate } from "../middleware/authMiddleware.js";

export const dashboardRoutes = Router();

dashboardRoutes.get("/", authenticate, dashboardController.getDashboard);
dashboardRoutes.get("/transport", authenticate, dashboardController.getTransportAssignments);
