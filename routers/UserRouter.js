const express = require("express");
const authController = require("../controllers/AuthController");
const router = express.Router();
const userController = require("../controllers/UserController");

router.route("/signUp").post(authController.signUp);

router.route("/").get(userController.getAllUsers);

//router.route("/:id").delete(userController.DeleteUser);

router.route("/login").get(authController.login);

router.route("/forgotPassword").post(authController.forgotPassword);

router.route("/resetPassword/:token").post(authController.resetPassword);

router
  .route("/:id")
  .delete(
    authController.protect,
    authController.restrictTo("admin", "guide"),
    userController.deleteUser
  );

router
  .route("/updateMe")
  .patch(authController.protect, userController.updateMe);

router
  .route("/changePassword")
  .patch(authController.protect, authController.updatePassword);

module.exports = router;
