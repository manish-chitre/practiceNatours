const AppError = require("../utils/appError");

const handleCastError = (err) => {
  let message = `Invalid ${err.name} path ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateId = (err) => {
  let message = err.message;
  return new AppError(message, 400);
};

sendDevError = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

sendProdError = (err, res) => {
  if (err.isOperational) {
    //operational error : send message to client.
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //programming errors log to console but don't leak error details to client.
    console.error(err);
    return res
      .status(500)
      .json({status: "error", message: "something went wrong"});
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "CastError") {
      err = handleCastError(err);
    } else if (err.code === "11000") {
      err = handleDuplicateId(err);
    }
    sendProdError(err, res);
  }
};
