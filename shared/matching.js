const BLOOD_COMPATIBILITY = {
  O: ["O", "A", "B", "AB"],
  A: ["A", "AB"],
  B: ["B", "AB"],
  AB: ["AB"],
};

export const isBloodCompatible = (donorBloodGroup, recipientBloodGroup) => {
  const supportedRecipients = BLOOD_COMPATIBILITY[donorBloodGroup] ?? [];
  return supportedRecipients.includes(recipientBloodGroup);
};

export const filterCompatibleRecipients = (donor, recipients) =>
  recipients.filter(
    (recipient) =>
      recipient.organ === donor.organ &&
      isBloodCompatible(donor.bloodGroup, recipient.bloodGroup),
  );

export const sortRecipientsByPriority = (recipients) =>
  [...recipients].sort((left, right) => {
    if (right.urgency !== left.urgency) {
      return right.urgency - left.urgency;
    }

    return right.waitingTime - left.waitingTime;
  });

export const computeRecipientScore = (donor, recipient, position = 0) => {
  const compatibilityScore = isBloodCompatible(donor.bloodGroup, recipient.bloodGroup) ? 45 : 0;
  const urgencyScore = Math.min(35, recipient.urgency * 3.5);
  const waitingScore = Math.min(15, recipient.waitingTime / 20);
  const proximityScore = donor.hospitalId && donor.hospitalId === recipient.hospitalId ? 5 : 0;
  const rankPenalty = position * 2;

  return Math.max(0, Math.round((compatibilityScore + urgencyScore + waitingScore + proximityScore - rankPenalty) * 10) / 10);
};

export const buildAllocationReason = (donor, recipient, score) => [
  `Blood compatibility confirmed: ${donor.bloodGroup} donor to ${recipient.bloodGroup} recipient`,
  `Urgency contributed strongly with clinical score ${recipient.urgency}`,
  `Waiting time of ${recipient.waitingTime} days increased recipient priority`,
  donor.hospitalId && donor.hospitalId === recipient.hospitalId
    ? "Same hospital network improved transport viability"
    : "Cross-hospital transfer remains clinically viable",
  `Composite match score calculated at ${score}`,
];

export const explainAllocation = (donor, recipient) => [
  `${donor.bloodGroup} donor is compatible with ${recipient.bloodGroup} recipient`,
  `Urgency score ${recipient.urgency} was the highest among eligible recipients`,
  `Waiting time of ${recipient.waitingTime} days was used as the tie-breaker`,
];

export const findBestRecipient = (donor, recipients) => {
  const eligibleRecipients = filterCompatibleRecipients(donor, recipients);
  const prioritizedRecipients = sortRecipientsByPriority(eligibleRecipients);
  const selectedRecipient = prioritizedRecipients[0] ?? null;

  return {
    eligibleRecipients,
    prioritizedRecipients,
    selectedRecipient,
    explanation: selectedRecipient ? explainAllocation(donor, selectedRecipient) : [],
  };
};

export { BLOOD_COMPATIBILITY };
