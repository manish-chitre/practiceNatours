const express = require("express");
const authController = require("../controllers/AuthController");
const router = express.Router();
const userController = require("../controllers/UserController");

router.route("/signUp").post(authController.signUp);

router.route("/").get(userController.getAllUsers);

router.route("/:id").delete(userController.DeleteUser);

router.route("/login", userController.login);

module.exports = router;
