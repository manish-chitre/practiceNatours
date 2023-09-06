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

exports.DeleteUser = catchAsync(async (req, res, next) => {
  let deletedUser = await User.findByIdAndRemove({ _id: req.params.id });

  if (!deletedUser)
    return res
      .status(400)
      .json({ status: "fail", message: "user not found with id" });

  return res.status(200).json({ status: "success", data: { deletedUser } });
});
