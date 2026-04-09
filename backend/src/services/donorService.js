import { donorRepository } from "../repositories/donorRepository.js";
import { matchingService } from "./matchingService.js";
import { auditLogService } from "./auditLogService.js";
import { badRequest, notFound } from "../utils/apiError.js";

export const donorService = {
  async create(payload, actor) {
    const donor = await donorRepository.create(payload);

    await auditLogService.record({
      userId: actor?.sub,
      action: "CREATE",
      entityType: "DONOR",
      entityId: donor.id,
      metadata: { organType: donor.organType, bloodGroup: donor.bloodGroup },
    });

    let allocation = null;
    try {
      allocation = await matchingService.createPendingAllocation(donor.id, actor);
    } catch (error) {
      allocation = null;
    }

    return {
      donor,
      allocation,
      message: allocation
        ? "Donor added and pending allocation generated for approval."
        : "Donor added. No matching recipient available yet.",
    };
  },

  async list() {
    return donorRepository.list();
  },

  async getById(id) {
    const donor = await donorRepository.getById(id);
    if (!donor) throw notFound("Donor not found");
    return donor;
  },

  async update(id, updates, actor) {
    const donor = await donorRepository.update(id, updates);
    if (!donor) throw notFound("Donor not found");

    await auditLogService.record({
      userId: actor?.sub,
      action: "UPDATE",
      entityType: "DONOR",
      entityId: id,
      metadata: updates,
    });

    return donor;
  },

  async remove(id, actor) {
    const donor = await donorRepository.getById(id);
    if (!donor) throw notFound("Donor not found");
    if (donor.status === "ALLOCATED") throw badRequest("Allocated donors cannot be deleted");

    await donorRepository.remove(id);
    await auditLogService.record({
      userId: actor?.sub,
      action: "DELETE",
      entityType: "DONOR",
      entityId: id,
      metadata: { status: donor.status },
    });
  },
};
