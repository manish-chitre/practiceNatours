const Tour = require("../models/TourModel");
const factory = require("../controllers/handlerFactory");

exports.checkId = (req, res, next, value) => {
  Tour.countDocuments().then((noOfDocs) => {
    if (value > noOfDocs) {
      return res
        .status(404)
        .json({ status: "failed", message: "not valid id" });
    }
  });
  next();
};

exports.top5Cheap = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = "price,-ratingsAverage";
  req.query.fields = "name,duration,price,ratingsAverage";
  next();
};

exports.createTour = factory.createOne(Tour);

exports.getTour = factory.getOne(Tour, { path: "reviews" });

exports.getTours = factory.getAll(Tour);

exports.updateTour = factory.updateOne(Tour);

exports.deleteTour = factory.deleteOne(Tour);
