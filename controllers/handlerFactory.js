const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAll = (Model) => {
  return catchAsync(async (req, res, next) => {
    let features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .fields()
      .pagination();

    let docs = await features.query;

    if (docs.length == 0) {
      return res
        .status(400)
        .json({ status: "fail", message: "no documents found" });
    }

    return res.status(200).json({ status: "success", data: docs });
  });
};

exports.deleteOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    let doc = await Model.findByIdAndRemove(req.params.id);

    if (!doc) {
      return next(new AppError("There is no document with this id", 404));
    }

    return res.status(200).json({ status: "success", data: doc });
  });
};

exports.getOne = function (Model, popOptions) {
  return catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (popOptions) {
      query.populate(popOptions);
    }

    const doc = await query;

    if (!doc) {
      return next(new AppError("no document found with id", 404));
    }

    return res.status(200).json({ status: "success", data: doc });
  });
};

exports.updateOne = (Model, filteredObj) => {
  return catchAsync(async (req, res, next) => {
    if (filteredObj) {
      req.body = filteredObj;
    }

    let query = Model.findByIdAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });

    let updatedDoc = await query;

    if (!updatedDoc) {
      return next(new AppError("document with id not found", 401));
    }

    return res.status(201).json({ status: "success", data: updatedDoc });
  });
};

exports.createOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    if (!req.body)
      return res
        .status(404)
        .json({ status: "failed", message: "unable to create document" });

    let doc = await Model.create(req.body);

    return res.status(200).json({ status: "success", data: doc });
  });
};
