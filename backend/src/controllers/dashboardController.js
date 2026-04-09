import { dashboardService } from "../services/dashboardService.js";
import { allocationService } from "../services/allocationService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "../utils/respond.js";

export const dashboardController = {
  getDashboard: asyncHandler(async (req, res) => success(res, await dashboardService.getDashboard(req.user.role))),
  getTransportAssignments: asyncHandler(async (_req, res) => success(res, await allocationService.getTransportAssignments())),
};
