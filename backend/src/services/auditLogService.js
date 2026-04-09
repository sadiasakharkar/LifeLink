import { auditLogRepository } from "../repositories/auditLogRepository.js";

export const auditLogService = {
  async record({ userId, action, entityType, entityId, metadata }) {
    return auditLogRepository.create({
      userId: userId ?? "system",
      action,
      entityType,
      entityId,
      metadata: metadata ?? {},
    });
  },

  async list(filters = {}) {
    return auditLogRepository.list(filters);
  },
};
