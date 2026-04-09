import { randomUUID } from "node:crypto";
import { env } from "../config/env.js";
import { deleteItem, getItem, putItem, scanItems, updateItem } from "../utils/repository.js";

export const recipientRepository = {
  async create(recipient) {
    const item = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "WAITING",
      ...recipient,
    };

    await putItem(env.recipientsTable, item);
    return item;
  },

  async list(filters = {}) {
    const recipients = await scanItems(env.recipientsTable, filters);
    return recipients.sort((left, right) => right.urgency - left.urgency || right.waitingTime - left.waitingTime);
  },

  async getById(id) {
    return getItem(env.recipientsTable, id);
  },

  async update(id, updates) {
    return updateItem(env.recipientsTable, id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  },

  async remove(id) {
    return deleteItem(env.recipientsTable, id);
  },
};
