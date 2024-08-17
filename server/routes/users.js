const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const user = require("../controllers/users");
const { isLoggedIn } = require("../middleware");

router.route("/register").post(catchAsync(user.registerUser));

router.route("/").get((req, res) => {
  res.send("Hello Camper!");
});

router.route("/login").post(user.loginUser);

router.route("/getUser").get(user.getUser);

router.get("/logout", user.logoutUser);

router
  .route("/getAllFavorites")
  .get(isLoggedIn, catchAsync(user.getAllFavorites));

router
  .route("/getMyCampgrounds")
  .get(isLoggedIn, catchAsync(user.getMyCampgrounds));

module.exports = router;
