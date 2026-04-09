import { recipientRepository } from "../repositories/recipientRepository.js";
import { auditLogService } from "./auditLogService.js";
import { badRequest, notFound } from "../utils/apiError.js";

export const recipientService = {
  async create(payload, actor) {
    const recipient = await recipientRepository.create(payload);
    await auditLogService.record({
      userId: actor?.sub,
      action: "CREATE",
      entityType: "RECIPIENT",
      entityId: recipient.id,
      metadata: { organType: recipient.organType, bloodGroup: recipient.bloodGroup },
    });
    return recipient;
  },

  async list(filters = {}) {
    return recipientRepository.list(filters);
  },

  async getById(id) {
    const recipient = await recipientRepository.getById(id);
    if (!recipient) throw notFound("Recipient not found");
    return recipient;
  },

  async update(id, updates, actor) {
    if (updates.urgency !== undefined && (updates.urgency < 1 || updates.urgency > 10)) {
      throw badRequest("Urgency must be between 1 and 10");
    }

    const recipient = await recipientRepository.update(id, updates);
    if (!recipient) throw notFound("Recipient not found");

    await auditLogService.record({
      userId: actor?.sub,
      action: "UPDATE",
      entityType: "RECIPIENT",
      entityId: id,
      metadata: updates,
    });

    return recipient;
  },

  async remove(id, actor) {
    const recipient = await recipientRepository.getById(id);
    if (!recipient) throw notFound("Recipient not found");
    if (recipient.status === "ALLOCATED") throw badRequest("Allocated recipients cannot be deleted");

    await recipientRepository.remove(id);
    await auditLogService.record({
      userId: actor?.sub,
      action: "DELETE",
      entityType: "RECIPIENT",
      entityId: id,
      metadata: { status: recipient.status },
    });
  },
};
