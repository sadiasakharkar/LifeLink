import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { userRepository } from "../repositories/userRepository.js";
import { auditLogService } from "./auditLogService.js";
import { roles } from "../utils/validators.js";
import { badRequest, unauthorized } from "../utils/apiError.js";

const createToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      hospitalName: user.hospitalName ?? "",
    },
    env.jwtSecret,
    { expiresIn: "12h" },
  );

const sanitizeUser = (user) => {
  const { password, passwordHash, ...safeUser } = user;
  return safeUser;
};

export const authService = {
  async signup(payload) {
    const existingUser = await userRepository.findByEmail(payload.email);
    if (existingUser) {
      throw badRequest("Email already registered");
    }

    if (!roles.includes(payload.role)) {
      throw badRequest("Invalid role selected");
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);
    const user = await userRepository.create({
      name: payload.name,
      email: payload.email.toLowerCase(),
      passwordHash,
      role: payload.role,
      hospitalId: payload.hospitalId ?? payload.hospitalName ?? "general-hospital",
      hospitalName: payload.hospitalName ?? "General Hospital",
    });

    await auditLogService.record({
      userId: user.id,
      action: "SIGNUP",
      entityType: "USER",
      entityId: user.id,
      metadata: { role: user.role, email: user.email },
    });

    return {
      user: sanitizeUser(user),
      token: createToken(user),
    };
  },

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw unauthorized("Invalid email or password");
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      throw unauthorized("Invalid email or password");
    }

    await auditLogService.record({
      userId: user.id,
      action: "LOGIN",
      entityType: "USER",
      entityId: user.id,
      metadata: { role: user.role, email: user.email },
    });

    return {
      user: sanitizeUser(user),
      token: createToken(user),
    };
  },
};
