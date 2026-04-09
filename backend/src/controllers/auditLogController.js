import { auditLogService } from "../services/auditLogService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "../utils/respond.js";

export const auditLogController = {
  list: asyncHandler(async (req, res) => success(res, await auditLogService.list(req.query))),
};
