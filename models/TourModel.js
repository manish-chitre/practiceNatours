const mongoose = require("mongoose");
const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    duration: {
      type: String,
      required: [true, "duration is required"],
    },
    maxGroupSize: {
      type: Number,
    },
    ratingsAverage: {
      type: Number,
    },
    ratingsQuantity: {
      type: Number,
    },
    price: {
      type: Number,
    },
    summary: {
      type: String,
    },
    description: {
      type: String,
    },
    imageCover: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
    startDates: [
      {
        type: Date,
      },
    ],
  },
  {toJson: true, toObject: true}
);

const Tour = mongoose.model("Tour-Practice", tourSchema);

module.exports = Tour;
