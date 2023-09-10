const express = require("express");
const userRouter = require("./routers/UserRouter");
const tourRouter = require("./routers/TourRouter");
const rateLimit = require("express-rate-limit");
const globalErrorHandler = require("./controllers/ErrorController");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const reviewRouter = require("./routers/ReviewRouter");

const app = express();
app.use(express.json({ limit: "10kb" }));

//global middlewares
//1.security
app.use(helmet());

//Development
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

//rate limiter
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "To many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);

//data-sanitization against NOSQL query injection
app.use(mongoSanitize());

//Data sanitization against xss
app.use(xss());

//prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/reviews", reviewRouter);

app.use(globalErrorHandler);
module.exports = app;
