const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
      minLength: [3, "name must be minimum length of 6"],
      maxLength: [50, "name must be max length of 20"],
    },
    role: {
      type: String,
      required: [true, "user role is required"],
      trim: true,
      enum: ["user", "admin", "guide", "lead-guide"],
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
      select: false,
    },
    passwordConfirm: {
      type: String,
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: "password and passwordConfirm doesn't match",
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: String,
    lastLoginAt: {
      type: Date,
      default: "",
    },
    loginAttempts: {
      type: Number,
      default: 0,
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

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

userSchema.methods.passwordChangedAfter = function (JWTTimeStamp) {
  let passwordChangedAfter = "";

  if (this.passwordChangedAt) {
    passwordChangedAfter = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
  }

  return passwordChangedAfter > JWTTimeStamp;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  console.log(`resetToken before saving : ${resetToken}`);
  console.log(`passwordResetToken before saving ${this.passwordResetToken}`);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.comparePassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

(async () => {
  await User.ensureIndexes({ email: true }, { unique: true });
})();

module.exports = User;
