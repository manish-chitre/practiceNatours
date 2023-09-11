const express = require("express");
const authController = require("../controllers/AuthController");
const reviewController = require("../controllers/ReviewController");
const { route } = require("./UserRouter");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(authController.protect, reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.createReview
  );

router.use(authController.protect, authController.restrictTo("user", "admin"));

router
  .route("/:id")
  .post(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;
