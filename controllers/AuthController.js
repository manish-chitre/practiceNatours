const User = require("../models/UserModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/nodemailer");
const crypto = require("crypto");

exports.login = catchAsync(async (req, res, next) => {
  let { email, password } = req.body;

  if (!email) {
    return next(
      new AppError("Please email of the user to sign in the application", 400)
    );
  }

  if (!password) {
    return next(new AppError("password is not provided", 400));
  }

  let user = await User.findOne({ email: email }).select("+password");

  if (!user) {
    return next(
      new AppError(
        "Invalid Authentication! Please check your email address, and try again.",
        400
      )
    );
  }

  if (!user.comparePassword(password, user.password)) {
    return next(new AppError("Sorry,password doesn't match.", 400));
  }

  let token = signToken(user._id);

  return res.status(200).json({ status: "success", token: token });
});

exports.signUp = catchAsync(async (req, res, next) => {
  let user = await User.create(req.body);
  //After creating a user you need to send a jwt token to the user so
  //that he has chance to authenticate himself the next time when he wants
  //to work.

  let token = signToken(user._id);

  return res.status(200).json({
    status: "success",
    token: token,
    data: {
      user: user,
    },
  });
});

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "you can't access the specific route because your role is restricted"
        ),
        400
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  let email = req.body.email;

  if (!email)
    return next(
      new AppError("please provide email before you continue..", 400)
    );

  let user = await User.findOne({ email: req.body.email });

  if (!user)
    return next(new AppError("user associated with email doesn't exists", 400));

  let resetToken = user.createPasswordResetToken();

  let resetURL = `${req.protocol}:/${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  let message = `Forgot your password?Send a PATCH request with new password and passwordConfirm to ${resetURL}
  .If you don't please ignore this mail`;

  try {
    await sendMail({
      email: user.email,
      subject: "Your password reset token (valid for 10min)",
      message,
    });

    await user.save({ validateBeforeSave: false });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending mail.Please try again later")
    );
  }

  return res
    .status(200)
    .json({ status: "success", message: "token has been sent to mail" });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  let { currentPassword, newPassword, newPasswordConfirm } = req.body;

  if (currentPassword == newPassword) {
    return next(
      new AppError(
        "your currentpassword should not be same as pervious password.Please try with a new password",
        400
      )
    );
  }

  if (newPassword != newPasswordConfirm) {
    return next(
      new AppError("newPassword and newPasswordConfirm don't match", 400)
    );
  }

  let user = await User.findById(req.user._id).select("+password");

  console.log(user.email);
  console.log(user.password);

  if (!(await user.comparePassword(currentPassword, user.password))) {
    return next(
      new AppError(
        "Sorry, Your current password doesn't match to the one in database. Please try again.",
        400
      )
    );
  }

  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  await user.save();

  let token = signToken(user._id);

  return res.status(200).json({ status: "success", token: token });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  console.log(req.params.token);
  const resetToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  console.log(resetToken);

  let user = await User.findOne({
    passwordResetToken: resetToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("token has expired!", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const token = signToken(user._id);

  return res.status(200).json({ status: "success", token });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    let { authorization } = req.headers;
    token = authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("no token found please log in to continue", 400));
  }

  console.log(token);

  const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);

  console.log(decoded);

  const currentUser = await User.findById({ _id: decoded.id });

  if (!currentUser)
    return next(
      new AppError("The user belonging to this token doesn't exists", 400)
    );

  if (currentUser.passwordChangedAfter(decoded.iat)) {
    return next(
      new AppError(
        "Password has been changed recently after generation of token. Please login again to continue..",
        400
      )
    );
  }

  req.user = currentUser;

  next();
});
