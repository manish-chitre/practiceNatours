const express = require("express");
const router = express.Router();
const reviewRouter = require("./ReviewRouter");
const tourController = require("../controllers/TourController");
const authController = require("../controllers/AuthController");

router.param("id", tourController.checkId);

router.param("id", (req, res, next, value) => {
  console.log(`your id is : ${value}`);
  next();
});

router.use("/:tourId/reviews", reviewRouter);

router.route("/").get(tourController.getTours);

router
  .route("/top-5-cheap")
  .get(tourController.top5Cheap, tourController.getTours);

router.use(
  authController.protect,
  authController.restrictTo("admin", "lead-guide")
);

router
  .route("/tours-within/:distance/center/:latlng/units/:unit")
  .get(tourController.getTourWithin);

router.route("/").post(tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
