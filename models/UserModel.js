const mongoose = require("mongoose");
const validator = require("valdator");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
      minLength: [3, "name must be minimum length of 6"],
      maxLength: [20, "name must be max length of 20"],
    },
    role: {
      type: String,
      required: [true, "user role is required"],
      trim: true,
      enum: {
        value: ["user", "admin", "guide"],
        default: "user",
      },
    },
    email: {
      type: String,
      required: [true, "email must be present"],
      trim: true,
      validate: [validator.email, "email is not valid"],
    },
    photo: {
      type: String,
      required: [true, "photo must be present"],
      select: false,
    },
    password: {
      type: String,
      required: [true, "password must be present"],
    },
    passwordConfirm: {
      type: String,
      required: [true, "passwordConfirm must is required"],
      validate: {
        validator: function (val) {
          return val == this.password;
        },
        message: "password and passwordConfirm doesn't match",
      },
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const userModel = mongoose.Model("User", userSchema);

module.exports = userModel;
