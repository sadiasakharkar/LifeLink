import { randomUUID } from "node:crypto";

const now = new Date();

export const seedUsers = [
  {
    id: randomUUID(),
    name: "Anita Sharma",
    email: "admin@lifelink.org",
    password: "$2a$10$4oxhTO03rZtv8Ipu1xuKbezTATXxsw6byAZh/qIAiM4yJDQRwKw0C",
    role: "Hospital Admin",
    hospitalName: "Metro Care Hospital",
  },
  {
    id: randomUUID(),
    name: "Dr. Vikram Mehta",
    email: "doctor@lifelink.org",
    password: "$2a$10$4oxhTO03rZtv8Ipu1xuKbezTATXxsw6byAZh/qIAiM4yJDQRwKw0C",
    role: "Doctor",
    hospitalName: "Metro Care Hospital",
  },
  {
    id: randomUUID(),
    name: "Ravi Nair",
    email: "transport@lifelink.org",
    password: "$2a$10$4oxhTO03rZtv8Ipu1xuKbezTATXxsw6byAZh/qIAiM4yJDQRwKw0C",
    role: "Transport Team",
    hospitalName: "Metro Care Hospital",
  },
];

export const seedDonors = [
  {
    id: randomUUID(),
    organ: "Kidney",
    bloodGroup: "O",
    location: "Pune",
    timestamp: new Date(now.getTime() - 1000 * 60 * 45).toISOString(),
  },
];

export const seedRecipients = [
  {
    id: randomUUID(),
    name: "Neha Kapoor",
    organ: "Kidney",
    bloodGroup: "A",
    urgency: 9,
    waitingTime: 210,
    hospitalName: "Metro Care Hospital",
  },
  {
    id: randomUUID(),
    name: "Arjun Rao",
    organ: "Kidney",
    bloodGroup: "AB",
    urgency: 9,
    waitingTime: 260,
    hospitalName: "City General",
  },
  {
    id: randomUUID(),
    name: "Sana Iqbal",
    organ: "Liver",
    bloodGroup: "B",
    urgency: 8,
    waitingTime: 140,
    hospitalName: "Metro Care Hospital",
  },
  {
    id: randomUUID(),
    name: "Karthik Menon",
    organ: "Heart",
    bloodGroup: "AB",
    urgency: 10,
    waitingTime: 320,
    hospitalName: "Southline Clinic",
  },
];

export const seedAllocations = [];
