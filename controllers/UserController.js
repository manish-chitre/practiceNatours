const User = require("../models/UserModel");
const factory = require("../controllers/handlerFactory");

exports.getAllUsers = factory.getAll(User);

exports.deleteUser = factory.deleteOne(User);

exports.getUser = factory.getOne(User);

exports.filterUpdateUserReq = (req, res, next) => {
  filterObj(req.body, "name", "email");
  next();
};

const filterObj = function (obj, ...allowedFields) {
  let newObj = {};
  Object.keys(obj).forEach((ele) => {
    if (allowedFields.includes(ele)) {
      newObj[ele] = obj[ele];
    }
  });
  return newObj;
};

exports.updateUser = factory.updateOne(User);

exports.me = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};
