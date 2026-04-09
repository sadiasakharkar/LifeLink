import { allocationService } from "../services/allocationService.js";
import { matchingService } from "../services/matchingService.js";
import { emitEvent } from "../services/realtimeService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { badRequest } from "../utils/apiError.js";
import { success } from "../utils/respond.js";

export const matchController = {
  preview: asyncHandler(async (req, res) => {
    if (!req.body.donorId) {
      throw badRequest("donorId is required");
    }

    return success(res, await matchingService.previewMatch(req.body.donorId));
  }),

  allocate: asyncHandler(async (req, res) => {
    const allocation = await allocationService.create(req.body, req.user);
    emitEvent("allocation:created", allocation);
    return success(res, allocation, 201);
  }),

  latest: asyncHandler(async (_req, res) => {
    const allocations = await allocationService.list();
    return success(res, allocations[0] ?? null);
  }),
};
