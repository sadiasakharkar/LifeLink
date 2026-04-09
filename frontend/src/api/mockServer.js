const storageKey = "lifelink_demo_db";

const demoUsers = {
  admin: {
    id: "user-admin",
    name: "Dr. Aris Thorne",
    email: "admin@lifelink.org",
    role: "Hospital Admin",
    hospitalName: "Metro Care Hospital",
  },
  doctor: {
    id: "user-doctor",
    name: "Dr. Sarah Chen",
    email: "doctor@lifelink.org",
    role: "Doctor",
    hospitalName: "Metro Care Hospital",
  },
  transport: {
    id: "user-transport",
    name: "Dispatch Alpha",
    email: "transport@lifelink.org",
    role: "Transport Team",
    hospitalName: "Metro Care Hospital",
  },
};

const seedDatabase = () => ({
  users: Object.values(demoUsers),
  donors: [
    {
      id: "donor-1",
      organType: "Heart",
      bloodGroup: "O",
      location: "Central Surgical Hub A-12",
      hospitalId: "metro-care",
      hospitalName: "Metro Care Hospital",
      status: "MATCH_PENDING",
      createdAt: "2026-04-09T08:30:00.000Z",
    },
    {
      id: "donor-2",
      organType: "Kidney",
      bloodGroup: "A",
      location: "Saint Jude Medical Center, NY",
      hospitalId: "saint-jude",
      hospitalName: "Saint Jude Medical Center",
      status: "AVAILABLE",
      createdAt: "2026-04-08T14:10:00.000Z",
    },
    {
      id: "donor-3",
      organType: "Liver",
      bloodGroup: "B",
      location: "General City Hospital",
      hospitalId: "general-city",
      hospitalName: "General City Hospital",
      status: "ALLOCATED",
      createdAt: "2026-04-07T11:15:00.000Z",
    },
  ],
  recipients: [
    {
      id: "recipient-1",
      name: "Elena Rodriguez",
      organType: "Heart",
      bloodGroup: "O",
      urgency: 10,
      waitingTime: 142,
      hospitalId: "metro-care",
      hospitalName: "Metro Care Hospital",
      status: "WAITLIST",
    },
    {
      id: "recipient-2",
      name: "Marcus Chen",
      organType: "Kidney",
      bloodGroup: "A",
      urgency: 7,
      waitingTime: 89,
      hospitalId: "saint-jude",
      hospitalName: "Saint Jude Medical Center",
      status: "WAITLIST",
    },
    {
      id: "recipient-3",
      name: "Sarah J. Miller",
      organType: "Liver",
      bloodGroup: "B",
      urgency: 5,
      waitingTime: 12,
      hospitalId: "general-city",
      hospitalName: "General City Hospital",
      status: "RESERVED",
    },
    {
      id: "recipient-4",
      name: "James Wilson",
      organType: "Lung",
      bloodGroup: "AB",
      urgency: 9,
      waitingTime: 311,
      hospitalId: "metro-care",
      hospitalName: "Metro Care Hospital",
      status: "WAITLIST",
    },
  ],
  allocations: [
    {
      id: "allocation-1",
      donorId: "donor-3",
      recipientId: "recipient-3",
      status: "APPROVED",
      score: 94,
      createdAt: "2026-04-07T12:00:00.000Z",
      reviewedAt: "2026-04-07T12:15:00.000Z",
      approvedBy: "user-admin",
      notes: "Clinical team notified and transport acknowledged.",
      trackingStatus: "IN_TRANSIT",
      pickupLocation: "General City Hospital",
      dropLocation: "General City Hospital",
      etaMinutes: 18,
      explanation: [
        "Blood compatible donor-recipient pair.",
        "Recipient urgency ranked highest among eligible candidates.",
        "Waiting time reinforced final tie-break priority.",
      ],
      rankingList: [
        {
          recipientId: "recipient-3",
          recipientName: "Sarah J. Miller",
          organType: "Liver",
          bloodGroup: "B",
          urgency: 5,
          waitingTime: 12,
          score: 94,
        },
      ],
      transportUpdates: [
        { label: "Dispatch", status: "Vehicle assigned" },
        { label: "Route", status: "Priority corridor active" },
      ],
    },
  ],
  auditLogs: [
    {
      id: "log-1",
      userId: "user-admin",
      action: "LOGIN",
      entityType: "USER",
      entityId: "user-admin",
      timestamp: "2026-04-09T08:05:00.000Z",
      metadata: { role: "Hospital Admin" },
    },
    {
      id: "log-2",
      userId: "user-admin",
      action: "APPROVE",
      entityType: "ALLOCATION",
      entityId: "allocation-1",
      timestamp: "2026-04-07T12:15:00.000Z",
      metadata: { status: "APPROVED" },
    },
  ],
});

const compatMap = {
  O: ["O", "A", "B", "AB"],
  A: ["A", "AB"],
  B: ["B", "AB"],
  AB: ["AB"],
};

const parseBody = (body) => {
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body;
};

const clone = (value) => JSON.parse(JSON.stringify(value));

const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const loadDb = () => {
  const stored = localStorage.getItem(storageKey);
  if (!stored) {
    const seeded = seedDatabase();
    localStorage.setItem(storageKey, JSON.stringify(seeded));
    return seeded;
  }
  return JSON.parse(stored);
};

const saveDb = (db) => {
  localStorage.setItem(storageKey, JSON.stringify(db));
};

const logAction = (db, { userId = "user-admin", action, entityType, entityId, metadata = {} }) => {
  db.auditLogs.unshift({
    id: uid("log"),
    userId,
    action,
    entityType,
    entityId,
    timestamp: new Date().toISOString(),
    metadata,
  });
};

const getUserFromToken = (token) => {
  if (!token) return demoUsers.admin;
  if (token.includes("transport")) return demoUsers.transport;
  if (token.includes("doctor")) return demoUsers.doctor;
  return demoUsers.admin;
};

const withSnapshots = (db, allocation) => ({
  ...allocation,
  donorSnapshot: db.donors.find((item) => item.id === allocation.donorId) ?? null,
  recipientSnapshot: db.recipients.find((item) => item.id === allocation.recipientId) ?? null,
});

const rankRecipients = (db, donorId) => {
  const donor = db.donors.find((item) => item.id === donorId);
  if (!donor) {
    throw new Error("Donor not found");
  }

  const recipients = db.recipients
    .filter((recipient) => recipient.status !== "ALLOCATED")
    .filter((recipient) => recipient.organType === donor.organType)
    .filter((recipient) => (compatMap[donor.bloodGroup] ?? []).includes(recipient.bloodGroup))
    .map((recipient) => {
      const exactBloodBonus = recipient.bloodGroup === donor.bloodGroup ? 8 : 0;
      const localHospitalBonus = recipient.hospitalId === donor.hospitalId ? 4 : 0;
      const score = recipient.urgency * 10 + Math.min(recipient.waitingTime, 200) / 2 + exactBloodBonus + localHospitalBonus;
      return {
        recipientId: recipient.id,
        recipientName: recipient.name,
        organType: recipient.organType,
        bloodGroup: recipient.bloodGroup,
        urgency: recipient.urgency,
        waitingTime: recipient.waitingTime,
        score: Math.round(score),
      };
    })
    .sort((left, right) => right.score - left.score || right.urgency - left.urgency || right.waitingTime - left.waitingTime);

  return { donor, rankedCandidates: recipients };
};

const createAllocationFromMatch = (db, donorId, actorToken) => {
  const { donor, rankedCandidates } = rankRecipients(db, donorId);
  if (!rankedCandidates.length) {
    throw new Error("No compatible recipients found for this donor.");
  }

  const primaryCandidate = rankedCandidates[0];
  const recipient = db.recipients.find((item) => item.id === primaryCandidate.recipientId);
  const existing = db.allocations.find((item) => item.donorId === donorId && item.status === "PENDING");
  if (existing) {
    return withSnapshots(db, existing);
  }

  donor.status = "MATCH_PENDING";
  recipient.status = "RESERVED";

  const allocation = {
    id: uid("allocation"),
    donorId: donor.id,
    recipientId: recipient.id,
    status: "PENDING",
    score: primaryCandidate.score,
    createdAt: new Date().toISOString(),
    approvedBy: null,
    reviewedAt: null,
    notes: "",
    trackingStatus: "PREPARING",
    pickupLocation: donor.location,
    dropLocation: recipient.hospitalName,
    etaMinutes: 42,
    explanation: [
      `Blood compatibility matched ${donor.bloodGroup} donor to ${recipient.bloodGroup} recipient.`,
      `Urgency score ${recipient.urgency} placed ${recipient.name} at the top of the priority list.`,
      `${recipient.waitingTime} days on the waitlist reinforced the final decision.`,
    ],
    rankingList: rankedCandidates,
    transportUpdates: [
      { label: "Dispatch", status: "Awaiting assignment" },
      { label: "Route", status: "Optimization complete" },
    ],
  };

  db.allocations.unshift(allocation);
  logAction(db, {
    userId: getUserFromToken(actorToken).id,
    action: "CREATE",
    entityType: "ALLOCATION",
    entityId: allocation.id,
    metadata: { donorId, recipientId: recipient.id, status: "PENDING" },
  });

  return withSnapshots(db, allocation);
};

const buildDashboard = (db) => {
  const approvedCount = db.allocations.filter((item) => item.status === "APPROVED").length;
  const pendingCount = db.allocations.filter((item) => item.status === "PENDING").length;

  return {
    stats: [
      { label: "Total Donors", value: String(db.donors.length), trend: "+4 this week" },
      { label: "Active Recipients", value: String(db.recipients.filter((item) => item.status !== "ALLOCATED").length), trend: `Critical: ${db.recipients.filter((item) => item.urgency >= 9).length}` },
      { label: "Successful Allocations", value: String(approvedCount), trend: approvedCount ? "Strong clinical throughput" : "No approvals yet" },
      { label: "Pending Matches", value: String(pendingCount), trend: pendingCount ? "Requires review" : "Queue clear" },
    ],
    recentAllocations: db.allocations.slice(0, 4).map((item) => withSnapshots(db, item)),
    alerts: [
      { id: "alert-1", title: "New donor registered", detail: "Fresh donor intake is ready for clinical review.", priority: "info" },
      { id: "alert-2", title: pendingCount ? "Pending matches awaiting action" : "Approval queue clear", detail: pendingCount ? `${pendingCount} allocations need approval.` : "No blocked approvals right now.", priority: pendingCount ? "danger" : "success" },
    ],
    notifications: db.auditLogs.slice(0, 4).map((log) => ({
      id: log.id,
      title: `${log.action} · ${log.entityType}`,
      detail: typeof log.metadata === "object" ? Object.values(log.metadata).join(" · ") || "System event recorded." : "System event recorded.",
      priority: log.action === "REJECT" ? "danger" : log.action === "APPROVE" ? "success" : "info",
    })),
  };
};

const getTransportAssignments = (db) =>
  db.allocations
    .filter((item) => item.status !== "REJECTED")
    .slice(0, 6)
    .map((item) => withSnapshots(db, item));

export const mockRequest = async (path, options = {}, token) => {
  const method = (options.method ?? "GET").toUpperCase();
  const body = parseBody(options.body);
  const url = new URL(path, "https://lifelink.demo");
  const pathname = url.pathname;
  const db = loadDb();
  const currentUser = getUserFromToken(token);

  await new Promise((resolve) => window.setTimeout(resolve, 150));

  if (pathname === "/auth/login" && method === "POST") {
    const email = String(body.email ?? "").toLowerCase();
    const user =
      email.includes("transport") ? demoUsers.transport : email.includes("doctor") ? demoUsers.doctor : demoUsers.admin;
    logAction(db, { userId: user.id, action: "LOGIN", entityType: "USER", entityId: user.id, metadata: { role: user.role } });
    saveDb(db);
    return { token: `demo-token-${user.role.toLowerCase().replaceAll(" ", "-")}`, user };
  }

  if (pathname === "/auth/signup" && method === "POST") {
    const user = {
      id: uid("user"),
      name: body.name || "Clinical Coordinator",
      email: body.email || `demo-${Date.now()}@lifelink.org`,
      role: body.role || "Hospital Admin",
      hospitalName: body.hospitalName || "Metro Care Hospital",
    };
    db.users.unshift(user);
    logAction(db, { userId: user.id, action: "CREATE", entityType: "USER", entityId: user.id, metadata: { role: user.role } });
    saveDb(db);
    return { token: `demo-token-${user.role.toLowerCase().replaceAll(" ", "-")}`, user };
  }

  if (pathname === "/dashboard" && method === "GET") {
    return buildDashboard(db);
  }

  if (pathname === "/dashboard/transport" && method === "GET") {
    return getTransportAssignments(db);
  }

  if (pathname === "/donors" && method === "GET") {
    return clone(db.donors);
  }

  if (pathname === "/donors" && method === "POST") {
    const donor = {
      id: uid("donor"),
      organType: body.organType,
      bloodGroup: body.bloodGroup,
      location: body.location,
      hospitalId: body.hospitalId,
      hospitalName: body.hospitalName,
      status: "MATCH_PENDING",
      createdAt: new Date().toISOString(),
    };
    db.donors.unshift(donor);
    logAction(db, { userId: currentUser.id, action: "CREATE", entityType: "DONOR", entityId: donor.id, metadata: { organType: donor.organType } });
    createAllocationFromMatch(db, donor.id, token);
    saveDb(db);
    return { donor, message: "Donor saved and a pending allocation was generated for review." };
  }

  if (pathname.startsWith("/donors/") && method === "GET") {
    const donor = db.donors.find((item) => item.id === pathname.split("/").pop());
    if (!donor) throw new Error("Donor not found");
    return clone(donor);
  }

  if (pathname === "/recipients" && method === "GET") {
    return clone(db.recipients);
  }

  if (pathname === "/recipients" && method === "POST") {
    const recipient = {
      id: uid("recipient"),
      name: body.name,
      organType: body.organType,
      bloodGroup: body.bloodGroup,
      urgency: Number(body.urgency),
      waitingTime: Number(body.waitingTime),
      hospitalId: body.hospitalId,
      hospitalName: body.hospitalName,
      status: "WAITLIST",
    };
    db.recipients.unshift(recipient);
    logAction(db, { userId: currentUser.id, action: "CREATE", entityType: "RECIPIENT", entityId: recipient.id, metadata: { organType: recipient.organType } });
    saveDb(db);
    return clone(recipient);
  }

  if (pathname.startsWith("/recipients/") && method === "GET") {
    const recipient = db.recipients.find((item) => item.id === pathname.split("/").pop());
    if (!recipient) throw new Error("Recipient not found");
    return clone(recipient);
  }

  if (pathname.startsWith("/recipients/") && method === "PATCH") {
    const recipient = db.recipients.find((item) => item.id === pathname.split("/").pop());
    if (!recipient) throw new Error("Recipient not found");
    Object.assign(recipient, {
      urgency: body.urgency !== undefined ? Number(body.urgency) : recipient.urgency,
      waitingTime: body.waitingTime !== undefined ? Number(body.waitingTime) : recipient.waitingTime,
    });
    logAction(db, { userId: currentUser.id, action: "UPDATE", entityType: "RECIPIENT", entityId: recipient.id, metadata: { urgency: recipient.urgency } });
    saveDb(db);
    return clone(recipient);
  }

  if (pathname === "/allocations" && method === "GET") {
    const donorId = url.searchParams.get("donorId");
    const recipientId = url.searchParams.get("recipientId");
    let allocations = db.allocations;
    if (donorId) allocations = allocations.filter((item) => item.donorId === donorId);
    if (recipientId) allocations = allocations.filter((item) => item.recipientId === recipientId);
    return allocations.map((item) => withSnapshots(db, item));
  }

  if (pathname === "/match" && method === "POST") {
    return rankRecipients(db, body.donorId);
  }

  if (pathname === "/match/allocate" && method === "POST") {
    const allocation = createAllocationFromMatch(db, body.donorId, token);
    saveDb(db);
    return allocation;
  }

  if (pathname.endsWith("/approval") && method === "PATCH") {
    const allocationId = pathname.split("/")[2];
    const allocation = db.allocations.find((item) => item.id === allocationId);
    if (!allocation) throw new Error("Allocation not found");
    const donor = db.donors.find((item) => item.id === allocation.donorId);
    const recipient = db.recipients.find((item) => item.id === allocation.recipientId);

    allocation.status = body.status;
    allocation.notes = body.notes ?? "";
    allocation.approvedBy = currentUser.id;
    allocation.reviewedAt = new Date().toISOString();

    if (body.status === "APPROVED") {
      donor.status = "ALLOCATED";
      recipient.status = "ALLOCATED";
      allocation.trackingStatus = "IN_TRANSIT";
      allocation.transportUpdates = [
        { label: "Dispatch", status: "Transport team notified" },
        { label: "Route", status: "Live corridor secured" },
      ];
    } else {
      donor.status = "AVAILABLE";
      recipient.status = "WAITLIST";
      allocation.trackingStatus = "ON_HOLD";
    }

    logAction(db, {
      userId: currentUser.id,
      action: body.status === "APPROVED" ? "APPROVE" : "REJECT",
      entityType: "ALLOCATION",
      entityId: allocation.id,
      metadata: { notes: allocation.notes, status: allocation.status },
    });
    saveDb(db);
    return withSnapshots(db, allocation);
  }

  if (pathname.endsWith("/transport") && method === "PATCH") {
    const allocationId = pathname.split("/")[2];
    const allocation = db.allocations.find((item) => item.id === allocationId);
    if (!allocation) throw new Error("Allocation not found");

    allocation.trackingStatus = body.stage === "DELIVERED" ? "DELIVERED" : body.stage === "DISPATCHED" ? "IN_TRANSIT" : "PREPARING";
    allocation.etaMinutes = allocation.trackingStatus === "DELIVERED" ? 0 : allocation.trackingStatus === "IN_TRANSIT" ? 12 : 42;
    allocation.transportUpdates = [
      ...(allocation.transportUpdates ?? []),
      { label: "Update", status: body.note || allocation.trackingStatus },
    ].slice(-4);
    logAction(db, { userId: currentUser.id, action: "UPDATE", entityType: "ALLOCATION", entityId: allocation.id, metadata: { trackingStatus: allocation.trackingStatus } });
    saveDb(db);
    return withSnapshots(db, allocation);
  }

  if (pathname === "/audit-logs" && method === "GET") {
    let logs = db.auditLogs;
    const action = url.searchParams.get("action");
    const entityType = url.searchParams.get("entityType");
    if (action) logs = logs.filter((item) => item.action === action);
    if (entityType) logs = logs.filter((item) => item.entityType === entityType);
    return clone(logs);
  }

  throw new Error(`Demo endpoint not implemented: ${method} ${pathname}`);
};
