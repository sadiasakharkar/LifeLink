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
