import { donorService } from "../services/donorService.js";
import { emitEvent } from "../services/realtimeService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { badRequest } from "../utils/apiError.js";
import { bloodGroups, organs, requireFields } from "../utils/validators.js";
import { success } from "../utils/respond.js";

export const donorController = {
  create: asyncHandler(async (req, res) => {
    const validation = requireFields(req.body, ["organType", "bloodGroup", "location", "hospitalId"]);
    if (!validation.valid) {
      throw badRequest(`Missing fields: ${validation.missing.join(", ")}`);
    }

    if (!organs.includes(req.body.organType) || !bloodGroups.includes(req.body.bloodGroup)) {
      throw badRequest("Invalid organ or blood group");
    }

    const result = await donorService.create(req.body, req.user);
    emitEvent("donor:created", result.donor);
    if (result.allocation) {
      emitEvent("allocation:created", result.allocation);
    }
    return success(res, result, 201);
  }),

  list: asyncHandler(async (_req, res) => success(res, await donorService.list())),
  getById: asyncHandler(async (req, res) => success(res, await donorService.getById(req.params.id))),
  update: asyncHandler(async (req, res) => success(res, await donorService.update(req.params.id, req.body, req.user))),
  remove: asyncHandler(async (req, res) => {
    await donorService.remove(req.params.id, req.user);
    return success(res, { id: req.params.id });
  }),
};
