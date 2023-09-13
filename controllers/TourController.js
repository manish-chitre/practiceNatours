const Tour = require("../models/TourModel");
const factory = require("../controllers/handlerFactory");
const catchAsync = require("../utils/catchAsync");

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

exports.getTourWithin = catchAsync(async (req, res, next) => {
  let { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");
  const radius = (unit = "mi" ? distance / 3963.2 : distance / 6378.1); //covert it to radians.

  if (!lat || !lng) {
    return next(
      new AppError("Please provide latitude in the format in the lat,lng", 400)
    );
  }

  console.log(distance, lat, lng, unit);

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      data: tours,
    },
  });
});
