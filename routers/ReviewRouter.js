const express = require("express");
const authController = require("../controllers/AuthController");
const reviewController = require("../controllers/ReviewController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(authController.protect, reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.createReview
  );

router
  .route("/:id")
  .post(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.getReview
  )
  .patch(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.updateReview
  )
  .delete(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.deleteReview
  );

module.exports = router;
