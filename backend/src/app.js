import express from "express";
import cors from "cors";
import { authRoutes } from "./routes/authRoutes.js";
import { dashboardRoutes } from "./routes/dashboardRoutes.js";
import { donorRoutes } from "./routes/donorRoutes.js";
import { recipientRoutes } from "./routes/recipientRoutes.js";
import { matchRoutes } from "./routes/matchRoutes.js";
import { allocationRoutes } from "./routes/allocationRoutes.js";
import { auditLogRoutes } from "./routes/auditLogRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import { env } from "./config/env.js";
import { bootstrapService } from "./services/bootstrapService.js";

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(async (_req, _res, next) => {
    try {
      await bootstrapService.ensureSeedData();
      next();
    } catch (error) {
      next(error);
    }
  });

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/auth", authRoutes);
  app.use("/donor", donorRoutes);
  app.use("/donors", donorRoutes);
  app.use("/recipient", recipientRoutes);
  app.use("/recipients", recipientRoutes);
  app.use("/match", matchRoutes);
  app.use("/allocations", allocationRoutes);
  app.use("/dashboard", dashboardRoutes);
  app.use("/audit-logs", auditLogRoutes);

  app.use(errorHandler);

  return app;
};
