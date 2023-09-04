const express = require("express");
const app = express();
const tourRouter = require("./routers/TourRouter");
app.use(express.json());

if (process.env.NODE_ENV == "development") app.use(morgan("dev"));

app.use("/api/v1/tours", tourRouter);

module.exports = app;
