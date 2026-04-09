import { recipientService } from "../services/recipientService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { badRequest } from "../utils/apiError.js";
import { bloodGroups, organs, parseNumber, requireFields } from "../utils/validators.js";
import { success } from "../utils/respond.js";

export const recipientController = {
  create: asyncHandler(async (req, res) => {
    const validation = requireFields(req.body, ["name", "organType", "bloodGroup", "urgency", "waitingTime", "hospitalId"]);
    if (!validation.valid) {
      throw badRequest(`Missing fields: ${validation.missing.join(", ")}`);
    }

    if (!organs.includes(req.body.organType) || !bloodGroups.includes(req.body.bloodGroup)) {
      throw badRequest("Invalid organ or blood group");
    }

    const recipient = await recipientService.create(
      {
        ...req.body,
        urgency: parseNumber(req.body.urgency),
        waitingTime: parseNumber(req.body.waitingTime),
      },
      req.user,
    );
    return success(res, recipient, 201);
  }),

  list: asyncHandler(async (req, res) => success(res, await recipientService.list(req.query))),
  getById: asyncHandler(async (req, res) => success(res, await recipientService.getById(req.params.id))),
  update: asyncHandler(async (req, res) => {
    const updates = {
      ...req.body,
      urgency: req.body.urgency !== undefined ? parseNumber(req.body.urgency) : undefined,
      waitingTime: req.body.waitingTime !== undefined ? parseNumber(req.body.waitingTime) : undefined,
    };
    return success(res, await recipientService.update(req.params.id, updates, req.user));
  }),
  remove: asyncHandler(async (req, res) => {
    await recipientService.remove(req.params.id, req.user);
    return success(res, { id: req.params.id });
  }),
};
