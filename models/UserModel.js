const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

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
      enum: ["user", "admin", "guide"],
      default: "user",
    },
    email: {
      unique: true,
      type: String,
      required: [true, "email must be present"],
      trim: true,
      validate: [validator.isEmail, "email is not valid"],
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
          return val === this.password;
        },
        message: "password and passwordConfirm doesn't match",
      },
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
