import { allocationRepository } from "../repositories/allocationRepository.js";
import { donorRepository } from "../repositories/donorRepository.js";
import { recipientRepository } from "../repositories/recipientRepository.js";
import { auditLogService } from "./auditLogService.js";
import { findBestRecipient, filterCompatibleRecipients, sortRecipientsByPriority } from "../../../shared/matching.js";
import { badRequest, notFound } from "../utils/apiError.js";

const toRankedCandidates = (donor, recipients) =>
  sortRecipientsByPriority(filterCompatibleRecipients(donor, recipients)).map((recipient, index) => ({
    recipientId: recipient.id,
    recipientName: recipient.name,
    organType: recipient.organType,
    bloodGroup: recipient.bloodGroup,
    urgency: recipient.urgency,
    waitingTime: recipient.waitingTime,
    score: Math.max(70, 100 - index * 4 - Math.max(0, 10 - recipient.urgency)),
  }));

export const matchingService = {
  async previewMatch(donorId) {
    const donor = await donorRepository.getById(donorId);
    if (!donor) {
      throw notFound("Donor not found");
    }

    const recipients = (await recipientRepository.list()).filter((recipient) => recipient.status !== "ALLOCATED");
    const rankedCandidates = toRankedCandidates(donor, recipients);
    const { selectedRecipient, explanation } = findBestRecipient(
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
      explanation,
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
    const { selectedRecipient, explanation } = findBestRecipient(donorForMatching, normalizedRecipients);

    if (!selectedRecipient) {
      throw badRequest("No eligible recipient found");
    }

    const rankingList = toRankedCandidates(donorForMatching, normalizedRecipients);
    const topCandidate = rankingList[0];

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
