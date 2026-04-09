import { randomUUID } from "node:crypto";
import { env } from "../config/env.js";
import { deleteItem, getItem, putItem, scanItems, updateItem } from "../utils/repository.js";

export const allocationRepository = {
  async create(allocation) {
    const timestamp = new Date().toISOString();
    const item = {
      id: randomUUID(),
      createdAt: timestamp,
      updatedAt: timestamp,
      status: "PENDING",
      ...allocation,
    };

    await putItem(env.allocationsTable, item);
    return item;
  },

  async list(filters = {}) {
    const items = await scanItems(env.allocationsTable, filters);
    return items.sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
  },

  async getById(id) {
    return getItem(env.allocationsTable, id);
  },

  async findOpenByDonorId(donorId) {
    const items = await scanItems(env.allocationsTable, { donorId });
    return items.find((item) => item.status === "PENDING" || item.status === "APPROVED") ?? null;
  },

  async latest() {
    const items = await this.list();
    return items[0] ?? null;
  },

  async update(id, updates) {
    return updateItem(env.allocationsTable, id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  },

  async remove(id) {
    return deleteItem(env.allocationsTable, id);
  },
};
