import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { userRepository } from "../repositories/userRepository.js";
import { donorRepository } from "../repositories/donorRepository.js";
import { recipientRepository } from "../repositories/recipientRepository.js";

let bootstrapPromise;

const demoUsers = [
  {
    name: "Anita Sharma",
    email: "admin@lifelink.org",
    role: "Hospital Admin",
    hospitalId: "metro-care",
    hospitalName: "Metro Care Hospital",
  },
  {
    name: "Dr. Vikram Mehta",
    email: "doctor@lifelink.org",
    role: "Doctor",
    hospitalId: "metro-care",
    hospitalName: "Metro Care Hospital",
  },
  {
    name: "Ravi Nair",
    email: "transport@lifelink.org",
    role: "Transport Team",
    hospitalId: "metro-care",
    hospitalName: "Metro Care Hospital",
  },
];

const demoRecipients = [
  {
    name: "Neha Kapoor",
    organType: "Kidney",
    bloodGroup: "A",
    urgency: 9,
    waitingTime: 210,
    hospitalId: "metro-care",
    hospitalName: "Metro Care Hospital",
  },
  {
    name: "Arjun Rao",
    organType: "Kidney",
    bloodGroup: "AB",
    urgency: 9,
    waitingTime: 260,
    hospitalId: "city-general",
    hospitalName: "City General",
  },
  {
    name: "Sana Iqbal",
    organType: "Liver",
    bloodGroup: "B",
    urgency: 8,
    waitingTime: 140,
    hospitalId: "metro-care",
    hospitalName: "Metro Care Hospital",
  },
];

export const bootstrapService = {
  async ensureSeedData() {
    if (!env.seedDemoData) return;
    if (!bootstrapPromise) {
      bootstrapPromise = (async () => {
        const existingUsers = await userRepository.list();
        if (existingUsers.length === 0) {
          const passwordHash = await bcrypt.hash("Password@123", 10);
          for (const user of demoUsers) {
            await userRepository.create({ ...user, passwordHash });
          }
        }

        const recipients = await recipientRepository.list();
        if (recipients.length === 0) {
          for (const recipient of demoRecipients) {
            await recipientRepository.create(recipient);
          }
        }

        const donors = await donorRepository.list();
        if (donors.length === 0) {
          await donorRepository.create({
            organType: "Kidney",
            bloodGroup: "O",
            location: "Pune Central Facility",
            hospitalId: "metro-care",
            hospitalName: "Metro Care Hospital",
          });
        }
      })();
    }

    return bootstrapPromise;
  },
};
