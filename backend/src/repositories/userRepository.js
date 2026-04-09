import { randomUUID } from "node:crypto";
import { env } from "../config/env.js";
import { deleteItem, getItem, putItem, scanItems, updateItem } from "../utils/repository.js";

export const userRepository = {
  async create(user) {
    const item = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...user,
    };

    await putItem(env.usersTable, item);
    return item;
  },

  async list() {
    return scanItems(env.usersTable);
  },

  async getById(id) {
    return getItem(env.usersTable, id);
  },

  async findByEmail(email) {
    const users = await scanItems(env.usersTable, { email: email.toLowerCase() });
    return users[0] ?? null;
  },

  async update(id, updates) {
    return updateItem(env.usersTable, id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  },

  async remove(id) {
    return deleteItem(env.usersTable, id);
  },
};
