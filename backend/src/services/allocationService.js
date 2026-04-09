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
      await allocationRepository.update(id, {
        transport: {
          ...allocation.transport,
          currentStage: "DISPATCH_READY",
          etaMinutes: Math.max(12, (allocation.transport?.etaMinutes ?? 24) - 4),
          checkpoints: (allocation.transport?.checkpoints ?? []).map((checkpoint) =>
            checkpoint.label === "Cold-chain preparation"
              ? { ...checkpoint, status: "COMPLETED", timestamp: new Date().toISOString() }
              : checkpoint.label === "Courier dispatch"
                ? { ...checkpoint, status: "ACTIVE" }
                : checkpoint,
          ),
        },
      });
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

    return allocationRepository.getById(id);
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
    return allocations
      .filter((allocation) => allocation.status !== "REJECTED")
      .map((allocation, index) => ({
      ...allocation,
      pickupLocation: allocation.donorSnapshot?.location ?? "Allocation Hub",
      dropLocation: allocation.recipientSnapshot?.hospitalName ?? allocation.recipientSnapshot?.hospitalId ?? "Receiving Hospital",
      etaMinutes: allocation.transport?.etaMinutes ?? 22 + index * 8,
      trackingStatus:
        allocation.status === "APPROVED"
          ? allocation.transport?.currentStage === "DELIVERED"
            ? "DELIVERED"
            : "IN_TRANSIT"
          : "PREPARING",
      transportUpdates: (allocation.transport?.checkpoints ?? []).map((checkpoint) => ({
        label: checkpoint.label,
        status: checkpoint.status,
        timestamp: checkpoint.timestamp,
      })),
    }));
  },

  async updateTransportStage(id, payload, actor) {
    const allocation = await allocationRepository.getById(id);
    if (!allocation) throw notFound("Allocation not found");
    if (!["Transport Team", "Hospital Admin"].includes(actor?.role)) {
      throw forbidden("Only Transport Team or Admin can update transport");
    }

    const stageMap = {
      PREPARING: { currentStage: "COLD_CHAIN_READY", activeLabel: "Courier dispatch", etaDelta: -2 },
      DISPATCHED: { currentStage: "IN_TRANSIT", activeLabel: "Recipient handoff", etaDelta: -6 },
      DELIVERED: { currentStage: "DELIVERED", activeLabel: "Recipient handoff", etaDelta: 0 },
    };

    const stageConfig = stageMap[payload.stage];
    if (!stageConfig) throw badRequest("Invalid transport stage");

    const checkpoints = (allocation.transport?.checkpoints ?? []).map((checkpoint) => {
      if (checkpoint.label === stageConfig.activeLabel) {
        return {
          ...checkpoint,
          status: payload.stage === "DELIVERED" ? "COMPLETED" : "ACTIVE",
          timestamp: payload.stage === "DELIVERED" ? new Date().toISOString() : checkpoint.timestamp,
        };
      }

      if (payload.stage !== "PREPARING" && checkpoint.status === "ACTIVE") {
        return {
          ...checkpoint,
          status: "COMPLETED",
          timestamp: checkpoint.timestamp ?? new Date().toISOString(),
        };
      }

      return checkpoint;
    });

    const updated = await allocationRepository.update(id, {
      transport: {
        ...allocation.transport,
        currentStage: stageConfig.currentStage,
        etaMinutes: Math.max(0, (allocation.transport?.etaMinutes ?? 20) + stageConfig.etaDelta),
        checkpoints,
        latestNote: payload.note ?? "",
      },
    });

    await auditLogService.record({
      userId: actor.sub,
      action: "UPDATE",
      entityType: "TRANSPORT",
      entityId: id,
      metadata: { stage: payload.stage, note: payload.note ?? "" },
    });

    return updated;
  },
};
