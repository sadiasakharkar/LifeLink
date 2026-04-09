import { randomUUID } from "node:crypto";
import { env } from "../config/env.js";
import { putItem, scanItems } from "../utils/repository.js";

export const auditLogRepository = {
  async create(log) {
    const item = {
      id: randomUUID(),
      timestamp: new Date().toISOString(),
      ...log,
    };

    await putItem(env.auditLogsTable, item);
    return item;
  },

  async list(filters = {}) {
    const logs = await scanItems(env.auditLogsTable, filters);
    return logs.sort((left, right) => new Date(right.timestamp) - new Date(left.timestamp));
  },
};
