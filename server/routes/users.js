const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const user = require("../controllers/users");

router.route("/register").post(catchAsync(user.registerUser));

router.get("/", (req, res) => {
  res.send("Hello Camper!");
});

router.route("/login").post(user.loginUser);

router.get("/getUser", (req, res) => {
  res.send(req.user);
});

router.get("/logout", user.logoutUser);

module.exports = router;
