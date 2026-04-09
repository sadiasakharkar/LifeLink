export class ApiError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const notFound = (message) => new ApiError(404, message);
export const badRequest = (message, details) => new ApiError(400, message, details);
export const unauthorized = (message) => new ApiError(401, message);
export const forbidden = (message) => new ApiError(403, message);
