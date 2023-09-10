//review /rating /createdAt /ref to tour /ref to User.
const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "a review is required"],
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      required: [true, "a rating is required from 0 to 5"],
    },
    createdAt: Date,
    tour: { type: mongoose.Schema.ObjectId, ref: "Tours" },
    user: { type: mongoose.Schema.ObjectId, ref: "User" },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email",
  });
  next();
});

const Review = mongoose.model("reviews", reviewSchema);

module.exports = Review;
