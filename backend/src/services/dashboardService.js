import { allocationRepository } from "../repositories/allocationRepository.js";
import { donorRepository } from "../repositories/donorRepository.js";
import { recipientRepository } from "../repositories/recipientRepository.js";
import { notificationService } from "./notificationService.js";

export const dashboardService = {
  async getDashboard(role) {
    const recipients = await recipientRepository.list();
    const donors = await donorRepository.list();
    const allocations = await allocationRepository.list();

    const activeAlerts = recipients
      .filter((recipient) => recipient.urgency >= 8)
      .slice(0, 4)
      .map((recipient) => ({
        id: recipient.id,
        title: `${recipient.organ} recipient needs priority review`,
        detail: `${recipient.name} has urgency ${recipient.urgency} and has waited ${recipient.waitingTime} days`,
      }));

    return {
      stats: [
        { label: role === "Transport Team" ? "Active Deliveries" : "Pending Recipients", value: recipients.filter((recipient) => recipient.status !== "ALLOCATED").length, trend: "+4% today" },
        { label: "Available Donors", value: donors.filter((donor) => donor.status === "AVAILABLE").length, trend: "Live inventory" },
        { label: "Pending Approvals", value: allocations.filter((allocation) => allocation.status === "PENDING").length, trend: "Needs review" },
        { label: "Successful Allocations", value: allocations.filter((allocation) => allocation.status === "APPROVED").length, trend: "+2 this shift" },
      ],
      alerts: activeAlerts,
      notifications: await notificationService.listForDashboard(),
      recentAllocations: allocations.slice(0, 5),
    };
  },
};
