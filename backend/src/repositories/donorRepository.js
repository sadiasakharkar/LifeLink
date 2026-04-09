import { randomUUID } from "node:crypto";
import { env } from "../config/env.js";
import { deleteItem, getItem, putItem, scanItems, updateItem } from "../utils/repository.js";

export const donorRepository = {
  async create(donor) {
    const item = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "AVAILABLE",
      ...donor,
    };

    await putItem(env.donorsTable, item);
    return item;
  },

  async list(filters = {}) {
    const donors = await scanItems(env.donorsTable, filters);
    return donors.sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
  },

  async getById(id) {
    return getItem(env.donorsTable, id);
  },

  async update(id, updates) {
    return updateItem(env.donorsTable, id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  },

  async remove(id) {
    return deleteItem(env.donorsTable, id);
  },
};
