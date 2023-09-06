const fs = require("fs");
const Tour = require("../models/TourModel");
const mongoose = require("mongoose");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");

exports.checkId = (req, res, next, value) => {
  Tour.countDocuments().then((noOfDocs) => {
    if (value > noOfDocs) {
      return res.status(404).json({status: "failed", message: "not valid id"});
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

exports.createTour = catchAsync(async (req, res, next) => {
  if (!req.body)
    return res
      .status(404)
      .json({status: "failed", message: "unable to create tour"});

  let tourDocs = await Tour.countDocuments();
  console.log(tourDocs);

  let newTour = Object.assign({id: tourDocs + 1}, req.body);
  console.log(newTour);

  let tour = await Tour.create(newTour);

  return res.status(200).json({status: "success", data: tour});
});

exports.getTour = catchAsync(async (req, res, next) => {
  let tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError("no document found with id", 404));
  }

  return res
    .status(200)
    .json({status: "success", count: tours.length, data: tour});
});

exports.getTours = catchAsync(async (req, res, next) => {
  let features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .fields()
    .pagination();

  let tours = await features.query;

  return res.status(200).json({status: "success", data: tours});
});

exports.updateTour = catchAsync(async (req, res, next) => {
  let updatedDoc = await Tour.findByIdAndUpdate(
    {_id: req.params.id},
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedDoc) {
    return next(new AppError("document with id not found", 401));
  }

  return res.status(201).json({status: "success", data: updatedDoc});
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  let id = req.params.id;

  let tour = await Tour.findByIdAndRemove(id);

  if (!tour) {
    return res
      .status(404)
      .json({status: "failed", message: "sorry id is not found"});
  }
  return res.status(200).json({status: "success", data: tours});
});
