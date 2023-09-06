const express = require("express");
const app = express();
const userRouter = require("./routers/UserRouter");
const tourRouter = require("./routers/TourRouter");
const globalErrorHandler = require("./controllers/ErrorController");

app.use(express.json());

if (process.env.NODE_ENV == "development") app.use(morgan("dev"));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/tours", tourRouter);

app.use(globalErrorHandler);
module.exports = app;
