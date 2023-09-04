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
  .route("/:id")
  .all(tourController.checkId)
  .get(tourController.getTour)
  .post(tourController.createTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
