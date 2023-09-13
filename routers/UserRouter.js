const express = require("express");
const authController = require("../controllers/AuthController");
const userController = require("../controllers/UserController");
const router = express.Router();

router.route("/signUp").post(authController.signUp);
router.route("/login").get(authController.login);
router.route("/forgotPassword").post(authController.forgotPassword);
router.route("/resetPassword/:token").post(authController.resetPassword);

//protects all routes after this middleware.
router.use(authController.protect);

router
  .route("/me")
  .get(userController.me, userController.getUser)
  .delete(userController.me, userController.deleteUser)
  .patch(
    userController.me,
    userController.filterUpdateUserReq,
    userController.updateUser
  );

router.route("/changePassword").patch(authController.updatePassword);

//restrict to admin
router.use(authController.restrictTo("admin"));

router.route("/").get(userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getUser)
  .delete(userController.deleteUser)
  .patch(userController.updateUser);

module.exports = router;
