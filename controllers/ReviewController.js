const Review = require("../models/ReviewModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.createReview = catchAsync(async (req, res, next) => {
  console.log("This is something else..");
  console.log(req);
  const { tourId } = req.params;
  console.log(tourId);

  const review = await Review.create({
    review: `${req.body.review}`,
    rating: `${req.body.rating}`,
    tour: tourId,
    user: `${req.user._id}`,
  });
  return res.status(200).json({ status: "success", data: { review } });
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let reviews = null;
  console.log(req.params.tourId);
  if (req.params.tourId) {
    reviews = await Review.findOne({ tour: { _id: req.params.tourId } });
  } else {
    reviews = await Review.find();
  }
  return res.status(200).json({ status: "success", data: reviews });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const reviewId = req.params.id;
  const review = await Review.findById(reviewId);
  if (!review) {
    return next(new AppError("Review with this Id is not found", 404));
  }
  return res.status(200).json({ status: "success", data: { review } });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const reviewId = req.params.id;
  const review = await Review.findByIdAndRemove(reviewId);
  if (!review) {
    return next(new AppError("review with id not found", 404));
  }

  return res.status(200).json({ status: "success", data: { review } });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const reviewId = req.params.id;
  const review = await Review.findByIdAndUpdate(reviewId, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({ status: "success", data: { review } });
});
