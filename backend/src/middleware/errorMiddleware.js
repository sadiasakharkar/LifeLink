export const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode ?? 400;
  return res.status(statusCode).json({
    success: false,
    message: error.message ?? "Unexpected server error",
    details: error.details ?? undefined,
  });
};
