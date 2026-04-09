import { allocationService } from "../services/allocationService.js";
import { emitEvent } from "../services/realtimeService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "../utils/respond.js";

export const allocationController = {
  list: asyncHandler(async (req, res) => success(res, await allocationService.list(req.query))),
  getById: asyncHandler(async (req, res) => success(res, await allocationService.getById(req.params.id))),
  approveOrReject: asyncHandler(async (req, res) => {
    const allocation = await allocationService.approveOrReject(req.params.id, req.body, req.user);
    emitEvent("allocation:updated", allocation);
    return success(res, allocation);
  }),
  remove: asyncHandler(async (req, res) => {
    await allocationService.remove(req.params.id, req.user);
    return success(res, { id: req.params.id });
  }),
};
