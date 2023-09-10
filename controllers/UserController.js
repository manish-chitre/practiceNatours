const User = require("../models/UserModel");
const factory = require("../controllers/handlerFactory");

exports.getAllUsers = factory.getAll(User);

exports.deleteUser = factory.deleteOne(User);

const filterObj = function (obj, ...allowedFields) {
  let newObj = {};
  Object.keys(obj).forEach((ele) => {
    if (allowedFields.includes(ele)) {
      newObj[ele] = obj[ele];
    }
  });
  return newObj;
};

exports.updateMe = (req, res, next) => {
  return factory.updateOne(User, filterObj(req.body, "name", "email"));
};
