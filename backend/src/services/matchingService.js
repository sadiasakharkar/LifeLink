import { allocationRepository } from "../repositories/allocationRepository.js";
import { donorRepository } from "../repositories/donorRepository.js";
import { recipientRepository } from "../repositories/recipientRepository.js";
import { auditLogService } from "./auditLogService.js";
import {
  buildAllocationReason,
  computeRecipientScore,
  findBestRecipient,
  filterCompatibleRecipients,
  sortRecipientsByPriority,
} from "../../../shared/matching.js";
import { badRequest, notFound } from "../utils/apiError.js";

const toRankedCandidates = (donor, recipients) =>
  sortRecipientsByPriority(filterCompatibleRecipients(donor, recipients)).map((recipient, index) => {
    const score = computeRecipientScore(donor, recipient, index);
    return {
      recipientId: recipient.id,
      recipientName: recipient.name,
      organType: recipient.organType,
      bloodGroup: recipient.bloodGroup,
      urgency: recipient.urgency,
      waitingTime: recipient.waitingTime,
      hospitalId: recipient.hospitalId,
      score,
      reasons: buildAllocationReason(donor, recipient, score),
    };
  });

export const matchingService = {
  async previewMatch(donorId) {
    const donor = await donorRepository.getById(donorId);
    if (!donor) {
      throw notFound("Donor not found");
    }

    const recipients = (await recipientRepository.list()).filter((recipient) => recipient.status !== "ALLOCATED");
    const rankedCandidates = toRankedCandidates(donor, recipients);
    const { selectedRecipient } = findBestRecipient(
      { organ: donor.organType, bloodGroup: donor.bloodGroup },
      recipients.map((recipient) => ({
        ...recipient,
        organ: recipient.organType,
      })),
    );

    return {
      donor,
      rankedCandidates,
      selectedRecipient,
      explanation:
        rankedCandidates.find((candidate) => candidate.recipientId === selectedRecipient?.id)?.reasons ?? [],
    };
  },

  async createPendingAllocation(donorId, actor) {
    const donor = await donorRepository.getById(donorId);
    if (!donor) {
      throw notFound("Donor not found");
    }

    if (donor.status === "ALLOCATED") {
      throw badRequest("Donor already allocated");
    }

    const existingAllocation = await allocationRepository.findOpenByDonorId(donorId);
    if (existingAllocation) {
      return existingAllocation;
    }

    const recipients = (await recipientRepository.list()).filter((recipient) => recipient.status === "WAITING");
    const normalizedRecipients = recipients.map((recipient) => ({
      ...recipient,
      organ: recipient.organType,
    }));
    const donorForMatching = {
      ...donor,
      organ: donor.organType,
    };
    const { selectedRecipient } = findBestRecipient(donorForMatching, normalizedRecipients);

    if (!selectedRecipient) {
      throw badRequest("No eligible recipient found");
    }

    const rankingList = toRankedCandidates(donorForMatching, normalizedRecipients);
    const topCandidate = rankingList[0];
    const explanation = topCandidate?.reasons ?? [];

    await donorRepository.update(donor.id, { status: "MATCH_PENDING" });
    await recipientRepository.update(selectedRecipient.id, { status: "RESERVED" });

    const allocation = await allocationRepository.create({
      donorId: donor.id,
      donorSnapshot: donor,
      recipientId: selectedRecipient.id,
      recipientSnapshot: selectedRecipient,
      status: "PENDING",
      explanation,
      score: topCandidate?.score ?? 90,
      rankingList,
      transport: {
        currentStage: "MATCH_CONFIRMED",
        etaMinutes: donor.hospitalId === selectedRecipient.hospitalId ? 18 : 34,
        checkpoints: [
          {
            label: "Match confirmed",
            status: "COMPLETED",
            timestamp: new Date().toISOString(),
          },
          {
            label: "Cold-chain preparation",
            status: "ACTIVE",
            timestamp: null,
          },
          {
            label: "Courier dispatch",
            status: "PENDING",
            timestamp: null,
          },
          {
            label: "Recipient handoff",
            status: "PENDING",
            timestamp: null,
          },
        ],
      },
      timestamps: {
        matchedAt: new Date().toISOString(),
      },
    });

    await auditLogService.record({
      userId: actor?.sub,
      action: "CREATE",
      entityType: "ALLOCATION",
      entityId: allocation.id,
      metadata: { donorId: donor.id, recipientId: selectedRecipient.id, status: "PENDING" },
    });

    return allocation;
  },
};
