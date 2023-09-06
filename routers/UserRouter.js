const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");

router.route("/signup", userController.signUp);
router.route("/login", userController.login);
