import { mockRequest } from "./mockServer.js";

export const apiRequest = async (path, options = {}, token) => {
  try {
    return await mockRequest(path, options, token);
  } catch (error) {
    throw new Error(error.message ?? "Unable to reach LifeLink demo services");
  }
};

export const API_URL = "frontend-demo";
