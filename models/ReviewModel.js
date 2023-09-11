//review /rating /createdAt /ref to tour /ref to User.
const mongoose = require("mongoose");
const Tour = require("../models/TourModel");

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

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  console.log(stats);

  await Tour.findByIdAndUpdate(
    { _id: tourId },
    { ratingsQuantity: stats[0].nRating, ratingsAverage: stats[0].avgRating }
  );
};

reviewSchema.post("save", function () {
  //this points to current reviews;
  this.constructor.calcAverageRatings(this.tour);
});

//creating a document from query to use it in post middleware to access statics method.

// reviewSchema.pre(/^findOneAnd/, async function (next) {
//   this.r = await this.clone().findOne();
//   console.log("This is amazing!!...");
//   console.log(this.r);
//   next();
// });

reviewSchema.post(/^findOneAnd/, async function (doc) {
  await doc.constructor.calcAverageRatings(doc.tour);
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email",
  });
  next();
});

//findByIdAndUpdate
//findByIdAndDelete

const Review = mongoose.model("reviews", reviewSchema);

module.exports = Review;
