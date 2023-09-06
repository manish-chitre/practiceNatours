class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;
    this.status = String(statusCode).startsWith("4") ? "fail" : "error";
    this.message = message;
    this.operationalErr = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
