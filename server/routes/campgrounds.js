const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateInput, isAuthor } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateInput,
    catchAsync(campgrounds.createCampground)
  );

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .patch(
    isLoggedIn,
    isAuthor,
    // upload.array("image"),
    validateInput,
    catchAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router
  .route("/:id/favorite")
  .post(isLoggedIn, catchAsync(campgrounds.addFavoriteCampground));

module.exports = router;
