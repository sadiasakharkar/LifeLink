import { allocationRepository } from "../repositories/allocationRepository.js";
import { donorRepository } from "../repositories/donorRepository.js";
import { recipientRepository } from "../repositories/recipientRepository.js";
import { auditLogService } from "./auditLogService.js";
import { matchingService } from "./matchingService.js";
import { badRequest, forbidden, notFound } from "../utils/apiError.js";

const approvalStatuses = ["APPROVED", "REJECTED"];

export const allocationService = {
  async list(filters = {}) {
    return allocationRepository.list(filters);
  },

  async getById(id) {
    const allocation = await allocationRepository.getById(id);
    if (!allocation) throw notFound("Allocation not found");
    return allocation;
  },

  async create(payload, actor) {
    if (!payload.donorId) throw badRequest("donorId is required");
    return matchingService.createPendingAllocation(payload.donorId, actor);
  },

  async approveOrReject(id, payload, actor) {
    const allocation = await allocationRepository.getById(id);
    if (!allocation) throw notFound("Allocation not found");

    if (!approvalStatuses.includes(payload.status)) {
      throw badRequest("Status must be APPROVED or REJECTED");
    }

    if (!["Hospital Admin", "Doctor"].includes(actor?.role)) {
      throw forbidden("Only Admin or Doctor can approve allocations");
    }

    if (allocation.status !== "PENDING") {
      throw badRequest("Only pending allocations can be updated");
    }

    const approvedAt = payload.status === "APPROVED" ? new Date().toISOString() : undefined;
    const rejectedAt = payload.status === "REJECTED" ? new Date().toISOString() : undefined;

    const updated = await allocationRepository.update(id, {
      status: payload.status,
      approvedBy: actor.sub,
      approvedAt,
      rejectedAt,
      approvalNotes: payload.notes ?? "",
      timestamps: {
        ...allocation.timestamps,
        decisionAt: new Date().toISOString(),
      },
    });

    if (payload.status === "APPROVED") {
      await donorRepository.update(allocation.donorId, { status: "ALLOCATED" });
      await recipientRepository.update(allocation.recipientId, { status: "ALLOCATED" });
    } else {
      await donorRepository.update(allocation.donorId, { status: "AVAILABLE" });
      await recipientRepository.update(allocation.recipientId, { status: "WAITING" });
    }

    await auditLogService.record({
      userId: actor.sub,
      action: payload.status === "APPROVED" ? "APPROVE" : "REJECT",
      entityType: "ALLOCATION",
      entityId: id,
      metadata: { notes: payload.notes ?? "" },
    });

    return updated;
  },

  async remove(id, actor) {
    const allocation = await allocationRepository.getById(id);
    if (!allocation) throw notFound("Allocation not found");
    await allocationRepository.remove(id);
    await auditLogService.record({
      userId: actor?.sub,
      action: "DELETE",
      entityType: "ALLOCATION",
      entityId: id,
      metadata: { status: allocation.status },
    });
  },

  async getTransportAssignments() {
    const allocations = await allocationRepository.list();
    return allocations.map((allocation, index) => ({
      ...allocation,
      pickupLocation: allocation.donorSnapshot?.location ?? "Allocation Hub",
      dropLocation: allocation.recipientSnapshot?.hospitalName ?? allocation.recipientSnapshot?.hospitalId ?? "Receiving Hospital",
      etaMinutes: 22 + index * 8,
      trackingStatus: allocation.status === "APPROVED" ? "IN_TRANSIT" : "PREPARING",
      transportUpdates: [
        "Driver dispatched from regional command center.",
        "Cold-chain verification complete.",
      ],
    }));
  },
};
