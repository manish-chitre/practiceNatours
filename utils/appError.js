class AppError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status || 500;
    this.statusCode = status.startsWith("4") ? "fail" : "error";
    this.message = message;
    this.operationalErr = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
