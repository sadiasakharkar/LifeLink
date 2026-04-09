import { auditLogRepository } from "../repositories/auditLogRepository.js";

const priorities = {
  APPROVED: "success",
  REJECTED: "danger",
  PENDING: "warning",
  CREATE: "info",
  UPDATE: "info",
  DELETE: "danger",
  LOGIN: "info",
};

export const notificationService = {
  async listForDashboard(limit = 8) {
    const logs = await auditLogRepository.list();

    return logs.slice(0, limit).map((log) => ({
      id: log.id,
      title: `${log.action} ${log.entityType}`,
      detail:
        log.entityType === "ALLOCATION"
          ? `Allocation ${log.entityId} changed with action ${log.action.toLowerCase()}.`
          : `${log.entityType} ${log.entityId} recorded action ${log.action.toLowerCase()}.`,
      priority: priorities[log.action] ?? "info",
      timestamp: log.timestamp,
      metadata: log.metadata ?? {},
    }));
  },
};
