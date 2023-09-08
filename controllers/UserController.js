const User = require("../models/UserModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  let users = await User.find();
  console.log(users);
  if (users.length == 0) {
    console.log("this is something big");
    return next(new AppError("no user registrations found", 404));
  }
  return res.status(200).json({ status: "success", data: { users } });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  let deletedUser = await User.findByIdAndRemove({ _id: req.params.id });

  if (!deletedUser)
    return res
      .status(400)
      .json({ status: "fail", message: "user not found with id" });

  return res.status(200).json({ status: "success", data: { deletedUser } });
});

const filterObj = function (obj, ...allowedFields) {
  let newObj = {};
  Object.keys(obj).forEach((ele) => {
    if (allowedFields.includes(ele)) {
      newObj[ele] = obj[ele];
    }
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, "name", "email");
  let updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });
  return res.status(200).json({ status: "success", data: updatedUser });
});
