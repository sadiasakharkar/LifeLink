import { authService } from "../services/authService.js";
import { requireFields } from "../utils/validators.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { badRequest } from "../utils/apiError.js";
import { success } from "../utils/respond.js";

export const authController = {
  signup: asyncHandler(async (req, res) => {
    const validation = requireFields(req.body, ["name", "email", "password", "role"]);
    if (!validation.valid) {
      throw badRequest(`Missing fields: ${validation.missing.join(", ")}`);
    }

    const result = await authService.signup(req.body);
    return success(res, result, 201);
  }),

  login: asyncHandler(async (req, res) => {
    const validation = requireFields(req.body, ["email", "password"]);
    if (!validation.valid) {
      throw badRequest(`Missing fields: ${validation.missing.join(", ")}`);
    }

    const result = await authService.login(req.body);
    return success(res, result);
  }),
};
