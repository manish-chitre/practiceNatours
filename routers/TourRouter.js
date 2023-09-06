const express = require("express");
const router = express.Router();
const tourController = require("../controllers/TourController");

router.param("id", tourController.checkId);

router.param("id", (req, res, next, value) => {
  console.log(`your id is : ${value}`);
  next();
});

router.route("/").get(tourController.getTours);

router
  .route("/top-5-cheap")
  .get(tourController.top5Cheap, tourController.getTours);

router.route("/").post(tourController.createTour);

router
  .route("/:id")
  .get(tourController.checkId, tourController.getTour)
  .patch(tourController.checkId, tourController.updateTour)
  .delete(tourController.checkId, tourController.deleteTour);

module.exports = router;
