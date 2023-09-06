const User = require("../models/UserModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.signUp = catchAsync(async (req, res, next) => {
  let user = await User.create(req.body);
  return res.status(200).json({
    status: "success",
    data: {
      user: user,
    },
  });
});
